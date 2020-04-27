const TokenSale = artifacts.require("MyTokenSale.sol");
const Token = artifacts.require("MyToken.sol");
const Kyc = artifacts.require("KycContract.sol");

var chai = require("./setupchai");
var BN = web3.utils.BN;
const expect = chai.expect;

contract("PJ Sale Test", async (accounts) => {

    const [deployer, receiver, extra] = accounts;

    it("Should not have tokens in my deployed account", async() =>{
        let instance = await Token.deployed();
        return expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("All tokens in tokenSale when deployed", async () =>{
        let tokenSale = await TokenSale.address;
        let instance = await Token.deployed();
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(new BN(0));
        return expect(instance.balanceOf(tokenSale)).to.eventually.be.a.bignumber.equal(totalSupply);
        });

    it("Can buy Tokens from token Sale", async () =>{
        let tokenSale = await TokenSale.deployed();
        let instance = await Token.deployed();
        let initialBalance = await instance.balanceOf(deployer);
        let KycInstance = await Kyc.deployed();
        expect(instance.balanceOf(tokenSale.address)).to.eventually.be.a.bignumber.equal(new BN(process.env.INITIAL_TOKENS));
        expect(await KycInstance.setCompleteKYC(deployer,{from: deployer})).to.eventually.be.fulfilled;
        expect(tokenSale.sendTransaction({from: deployer, value: web3.utils.toWei("1","wei")})).to.eventually.be.fulfilled;
        return expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(initialBalance.add(new BN(1)));
    });
});