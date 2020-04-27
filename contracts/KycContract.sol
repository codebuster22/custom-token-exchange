pragma solidity ^0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable {
    mapping(address=>bool) kycStatus;

    function setCompleteKYC (address _candidate) public onlyOwner {
        kycStatus[_candidate] = true;
    }

    function setRevokeKYC (address _candidate) public onlyOwner {
        kycStatus[_candidate] = false;
    }

    function getKycStatus (address _candidate) public view returns(bool){
        return kycStatus[_candidate];
    }
}
