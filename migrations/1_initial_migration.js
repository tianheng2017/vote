var VoteData = artifacts.require("./vote-system/VoteData.sol");
var VoteControl = artifacts.require("./vote-system/VoteControl.sol");

module.exports = async function (deployer) {
    // 部署VoteData合约
    await deployer.deploy(VoteData, "0x2F46384028A46e16BD34C1474eF4F281dbE4807E")
    const voteDataInstance = await VoteData.deployed()

    // 部署VoteControl合约
    await deployer.deploy(VoteControl, "0x2F46384028A46e16BD34C1474eF4F281dbE4807E", voteDataInstance.address)
    const voteControlInstance = await VoteControl.deployed()

    // 将VoteControl合约的地址设置到VoteData合约中
    await voteDataInstance.setVoteControlAddr(voteControlInstance.address)

    // 检查是否设置成功
    const voteControlAddr = await voteDataInstance.voteControlAddr_.call()
    console.log("   > 读取VoteData合约中voteControlAddr_的值为: ", voteControlAddr, "\n")
};
