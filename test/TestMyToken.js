const Token = artifacts.require("MyToken.sol");

var chai = require("./setupchai");
var BN = web3.utils.BN;
const expect = chai.expect;

contract("PJ Test", async (accounts) => {

    const [deployer, receiver, extra] = accounts;

    beforeEach(async()=>{
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("PJ should be mine", async () =>{
        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(totalSupply);
    });
    it("PJ can be transfered" , async () => {

        const sendToken = 1;
        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(receiver,sendToken)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
        return expect(instance.balanceOf(receiver)).to.eventually.be.a.bignumber.equal(new BN(sendToken));
    });
    it("PJ cannot to exceed total limit", async () =>{
        let instance = await this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deployer);
        let totalSupply = await instance.totalSupply();
        expect(instance.transfer(receiver,new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    })
})