const TokenSale = artifacts.require("TokenSale");
const { expectEvent, shouldFail } = require('openzeppelin-test-helpers');

//stores MODE environment, npm run coverage
const mode = process.env.MODE;

let TokenInstance;

//owner = msg.sender, account(0)
contract("TokenSale", accounts => {

  before(async function(){
    TokenInstance = await TokenSale.deployed();
  });

  after("write coverage/profiler output", async () => {
    if (mode === "profile") {
      await global.profilerSubprovider.writeProfilerOutputAsync();
    } else if (mode === "coverage") {
      await global.coverageSubprovider.writeCoverageAsync();
    }
  });

  // 1. Owner deploys contract
  describe('Owner Properties', function(){

    describe('Owner Address', function(){
      it("should have owner address be same address as the deployed contract", async () => {     
        const owner = accounts[0];

        assert.equal(
          (await TokenInstance.owner()),
          owner,
          "initial owner is not address expected."
          );
      });
    });

    describe('Only Owner', function onlyOwner(){
      it("should allow owner to call functions with the onlyOwner modifier", async () => {
        let currentOwner = accounts[0];
        assert.equal(
          (await TokenInstance.owner()),
          currentOwner,
          "current owner does not have ownership to access function"
        );
      });
      it("should allow if non owner calls a function with the onlyOwner modifier", async () => {
        let currentOwner = accounts[0];
        let newOwner = accounts[1];
      
        assert.equal(
          (await TokenInstance.owner()),
          currentOwner,
          "onlyOwner, does not allow"
        );
        await shouldFail.reverting(TokenInstance.transferOwner(newOwner, {from: newOwner}));
      });
    });
    describe('Transfer Ownership', function transferOwner(newOwner){
      it("Should allow owner to transfer ownership", async function() {
        const currentOwner = accounts[0];
        const newOwner = accounts[1];

        assert.equal(
          (await TokenInstance.owner()),
          currentOwner,
          "Initial owner is not address expected."
        );

        await TokenInstance.transferOwner(newOwner);

        assert.equal(
          (await TokenInstance.owner()),
          newOwner,
          "Updated owner address is not `newOwner`'s address"
        ); 
     });
    });

    describe('Owner BalanceOf', function(){ 
      it('should return the correct owner balance', async function () {
        let owner = accounts[0];

        assert.equal(
          (await TokenInstance.balanceOf(owner)),
          0,
          "owner balance does not match"
        );
      });
    });

    
  });
  
  // 2. Owner sells to buyer from TokenSale
  describe('Transfer Tokens: Sell', function(){

    describe('Purchase from the Same Owner Address', function(){
      it("should let owner send tokens back to themselves: same address", async () => {     
        let owner = accounts[0];
        let sameOwner = accounts[0];

        await shouldFail.reverting(
          TokenInstance.sellTokens(sameOwner, 10, { from: owner })
        );
      });
      it("should revert let owner send tokens to another address", async () => {     
        let owner = accounts[0];
        let otherAddress = accounts[1];

        await shouldFail.reverting(
          TokenInstance.sellTokens(otherAddress, 10, { from: owner })
        );
      });
    });
    describe('Selling Tokens Function', function(){

      it("should decrease tokens from owner's address");//, async () => {     
 
      it("should not sell more tokens then their balance");

      it("should increase tokens in buyer's address");

      it("should return true for successful transfers");

    });
  });  
  // 3. Event Logs
  describe('Events', function(){
    
    describe('Sell Tokens Event', function(){
      it('should emit SellTokens log upon successful transactions', async () => {
        let Seller = accounts[0];
        let Buyer = accounts[1];
        let amount = 10;
        const { logs } = await TokenInstance.sellTokens(Seller, Buyer);

        await expectEvent.inLogs(logs, 'SellTokens', { Seller, Buyer, amount })        
      });
    });
    describe('Minting Event', function(){
      it('should emit Mint log upon successful Minting', async () => {
        let mintOwner = accounts[0];
        let amount = 150;
        const { logs } = await TokenInstance.minting(mintOwner, amount);
        
        await expectEvent.inLogs(logs, 'Minting', { mintOwner, amount })   
        
      });
    });
    describe('Transfer Ownership Event', function(){
      it('should emit OwnershipTransferred log upon successful Owner Transfer', async () => {
        let currentOwner = accounts[0];
        let newOwner = accounts[1];
        const { logs } = await TokenInstance.transferOwner(currentOwner, { from: newOwner });
        
        await expectEvent.inLogs(logs, 'OwnershipTransferred', { currentOwner: newOwner, newOwner: currentOwner })   
        
      });
    });
  });

  // 4. Minting
  describe('Minting', function(){
    describe('Total Supply:', function(){
      it('totalSupply minted should be 0 at the beginning', async () => {
        let minter = accounts[0];

        assert.equal(
          (await TokenInstance.getTotalSupply()),
          0,
          "Total Supply does not match initially at amount 0"
        );
      });
      describe('Max total supply tokens has not been reached', function(){
        it('should be mintable while totalSupplyMax is false', async () => {
          let minter = accounts[0];

          await TokenInstance.minting(minter, 3000) 
            
            assert.equal(
              (await TokenInstance.getTotalSupply()),
              3000,
              "total supply did not update with minting"
            );
            assert.equal(
              (await TokenInstance.balanceOf(minter)),
              3000,
              "minter balance did not update correctly"
            );
        });
      });
      describe('Reached max total supply tokens minted', function(){
        it('should stop minting when the total supply of tokens has been reached', async () => {
          let minter = accounts[0];
          
          await TokenInstance.maxTokens();
          
          assert.equal(
            (await TokenInstance.maxTokens()),
            true,
            "function maxTokens failed to return true"
          )

          await shouldFail.reverting(
            TokenInstance.minting(100, { from: minter })
          );
          
          it("should allow if Minter modifier tries to mint when Max Tokens are true");
        });         
      });
      it("should allow if nonOwner tries to mint with onlyOwner modifier", async () => {       
        let nonOwner = accounts[0];
        let amount = 200;

        assert.equal(
          (await TokenInstance.owner()),
          nonOwner,
          "nonOwner is msg.sender"
        );
        await shouldFail.reverting(TokenInstance.minting(amount, {from: nonOwner}));
      });
    });
  });
    
});
