pragma solidity ^0.6.0;

import "./CrowdSale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {

    KycContract public kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
    Crowdsale(rate, wallet, token)
    public
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.getKycStatus(beneficiary)==true, "KYC not completed");
    }
}
