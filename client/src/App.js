import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { isLoaded: false,
            kycAddress: "",
            mySaleContractAddress: "",
            myTokenContractAddress: "",
            accountBalance: 0,
            buyTokenInstance: 0,
          };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.MyTokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
          MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.MyTokenSaleInstance = new this.web3.eth.Contract(
          MyTokenSale.abi,
          MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.KycContractInstance = new this.web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
        this.listenToTransfer();
      this.setState({isLoaded: true, mySaleContractAddress: MyTokenSale.networks[this.networkId].address, myTokenContractAddress: MyToken.networks[this.networkId].address }, this.updateAccountBalance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onInputChange = (event) => {
    const target = event.target;
    const value = (target.type === "checkbox") ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  };

  listenToTransfer() {
      this.MyTokenInstance.events.Transfer({to: this.accounts[0]}).on("data",this.updateAccountBalance);
  }

  updateAccountBalance = async () => {
      const balance = await this.MyTokenInstance.methods.balanceOf(this.accounts[0]).call();
      this.setState({
          accountBalance: balance,
      })
  };

  onTokenBuy = async () => {
      await this.MyTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei(this.state.buyTokenInstance,"wei")})
  }

  onKycSubmit = async () => {
      await this.KycContractInstance.methods.setCompleteKYC(this.state.kycAddress).send({from: this.accounts[0]});
      alert("KYC Completed for :-"+this.state.kycAddress);
  };

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>!PJ Token Exchange!</h1>
        <p>Grab your own PJ Token Now</p>
        <h2>KYC Update</h2>
        <div>
          Enter Your Address:-
          <input type={"text"} placeholder={"0xabc123...."} name={"kycAddress"} value={this.state.kycAddress} onChange={this.onInputChange}/>
            <button type={"button"} onClick={this.onKycSubmit}>Complete KYC</button>
        </div>
          <div>
              <h1>Buy More Tokens:-</h1>
              <p>
                  <input type={"text"} placeholder={"0"} name={"buyTokenInstance"} value={this.state.buyTokenInstance} onChange={this.onInputChange}/>
                  PJ Tokens
              </p>
              <button type={"button"} onClick={this.onTokenBuy}>Buy PJ</button>
          </div>
          <p>
              To Buy Token send Ether on Following Address <strong>{this.state.mySaleContractAddress}</strong>. The Exchange rate is 1 PJ Token = 1 Wei.
          </p>
          <p>
              Add Token Address in MetaMask to view Balance <strong>{this.state.myTokenContractAddress}</strong>. The Exchange rate is 1 PJ Token = 1 Wei.
          </p>
          <div>
              <p>You have <strong>{this.state.accountBalance}</strong> PJ</p>
          </div>
      </div>
    );
  }
}

export default App;
