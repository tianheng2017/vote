import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { showDialog } from 'vant'
import Web3 from 'web3'
import VoteControl from '@/contracts/VoteControl.json'
import VoteData from '@/contracts/VoteData.json'

const useAppStore = defineStore('app', () => {
    // 钱包信息
    const isConnect = ref(false)
    const address = ref('')
    const subAddress = computed(() => {
        return address.value.slice(0, 3) + '...' + address.value.slice(-3)
    })
    const dapp = reactive({
        web3: null,
        voteControlInstance: null,
        voteDataInstance: null,
    })

    // 钱包初始化
    const dappInit = async () => {
        try {
            // 检查环境
            if (typeof window.ethereum == 'undefined') {
                throw { code: -1, message: "请安装metamask或在dapp环境中打开页面" }
            }
            // 监听钱包切换
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            });
            // 监听网络切换
            window.ethereum.on('chainChanged', () => {
                window.location.reload()
            })
            // 检查钱包是否解锁
            window.ethereum._metamask.isUnlocked().then((res) => {
                if (!res) throw { code: -1, message: "请解锁您的钱包" }
            })
            // 检查网络是否为ganache（网络id 1337）
            if (window.ethereum.chainId !== 1337 && window.ethereum.networkVersion !== '1337') {
                throw { code: -1, message: "请切换到ganache网络" }
            }
            // 获取当前钱包地址
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            address.value = accounts[0]
            isConnect.value = true
            // 初始化web3
            dapp.web3 = new Web3(Web3.givenProvider)
            // 实例化VoteControl合约
            dapp.voteControlInstance = new dapp.web3.eth.Contract(VoteControl.abi, VoteControl.networks[1337].address)
            // 实例化VoteData合约
            dapp.voteDataInstance = new dapp.web3.eth.Contract(VoteData.abi, VoteData.networks[1337].address)
        } catch (error) {
            if (error.code == 4001) error.message = "用户拒绝连接钱包"
            if (error.code == -32002) error.message = "请求已经在等待处理，请耐心等待"
            return showDialog({ message: error.message })
        }
    }

    // 复制钱包地址
    const copy = () => {
        uni.setClipboardData({
            data: address.value,
            success: () => {
                uni.showToast({
                    title: '复制成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    }

    // 创建投票活动
    const newVote = async () => {
        try {
            const name = Math.floor(new Date().getTime() / 1000).toString();
            const res = await dapp.voteControlInstance.methods.newVote(name).send({ from: address.value})
            console.log(res)
            return showDialog({ message: `创建成功, blockNumber: ${res.blockNumber}` })
        } catch (error) {
            return showDialog({ message: error.message })
        }
    }

    // 查看最新投票活动
    const getLastVote = async () => {
        try {
            const res = await dapp.voteControlInstance.methods.getLastVote().call({ from: address.value })
            console.log(res)
            return showDialog({ message: `最新投票活动名称: ${res[1]}，下标: ${res[0]}` })
        } catch (error) {
            return showDialog({ message: error.message })
        }
    }

    return {
        dapp,
        isConnect,
        address,
        subAddress,
        dappInit,
        copy,
        newVote,
        getLastVote,
    }
}, {
    persist: true
})

export default useAppStore