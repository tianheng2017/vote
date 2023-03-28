<template>
    <van-config-provider :theme-vars="themeVars">
        <view>
            <!-- 导航栏 -->
            <van-nav-bar title="投票测试">
                <template #right>
                    <view class="text-white" v-if="appStore.isConnect" @tap="appStore.copy">{{ appStore.subAddress }}</view>
                    <view v-else>
                        <van-button type="primary" size="small" @click="appStore.dappInit">连接钱包</van-button>
                    </view>
                </template>
            </van-nav-bar>
            <view class="px-3 pt-3">
                <van-cell-group>
                    <van-cell title="Control Owner">
                        <template #value>{{ owner }}</template>
                    </van-cell>
                </van-cell-group>
                <van-cell-group>
                    <van-cell title="创建投票">
                        <template #value>
                            <van-button type="primary" size="small" @click="appStore.newVote()">创建</van-button>
                        </template>
                    </van-cell>
                </van-cell-group>
                <van-cell-group>
                    <van-cell title="最新投票活动">
                        <template #value>
                            <van-button type="primary" size="small" @click="appStore.getLastVote()">查看</van-button>
                        </template>
                    </van-cell>
                </van-cell-group>
            </view>
        </view>
    </van-config-provider>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()

const owner = ref('')
// 组件样式
const themeVars = reactive({
    navBarBackground: '#07c160',
    navBarTitleTextColor: '#fff',
});

// 生命周期钩子
onLoad(async () => {
    await appStore.dappInit()
    owner.value = await appStore.dapp.voteControlInstance.methods._owner().call()
})
</script>
