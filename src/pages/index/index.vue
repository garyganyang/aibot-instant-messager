<template>
	<view class="content">
		<view class="top-title">
			<view class="title">私有场景AI大模型</view>
			<view class="title-desc">您的私人AI助手</view>
		</view>
		<view class="mian-content">
			<template v-for="item in aiModels">
				<view class="card-view">
					<view class="title-category">{{item.category}}</view>
					<view v-for="modelItem in item.children" :key="modelItem.name" class="model-detail" @tap="goChat(modelItem)">
						<view class="name-header">
							<view class="left">
								<image :src="modelItem.image" mode="aspectFit"></image>
								<text>{{modelItem.name}}</text>
							</view>
							<text class="right">{{modelItem.nameDesc}}</text>
						</view>
						<view class="content-desc">
							<text>{{modelItem.description}}</text>
						</view>
					</view>
				</view>
			</template>
		</view>
		<view class="bottom-desc">
			<view class="company-name"></view>
			<view class="copyright">Copyright © 2024</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				aiModels: [
					{
						category: '能源与电力',
					  children: [
							{
								name: '水电厂检修与维护助手',
							  nameDesc: 'v0.0.8',
								image: require('@/static/hydropower.jpg'),
								description: '我是一名水电厂运营、检修与维护专家，可以为您提供全面、实用的建议和知识。无论您遇到什么问题，我都会尽力帮助您解决。',
								preMessage: '你好，我是一名专业的水电厂检修与维护专家，可以为您提供全面、实用的建议和知识。无论您遇到什么问题，我都会尽力帮助您解决。',
								botId: '7394291136765984803',
							}
					 ]
					},
					{
						category: '环境工程',
					  children: [
							{
								name: '污水处理建模助手',
							  nameDesc: 'v0.0.2',
								image: require('@/static/sewage.png'),
								description: '我是一名污水处理建模专家，可以帮助你解答与污水处理建模相关的各种问题。请告诉我你需要帮助的方面，我会尽力为你提供最优质的解答',
								preMessage: '我是一名污水处理建模专家，可以帮助你解答与污水处理建模相关的各种问题。请告诉我你需要帮助的方面，我会尽力为你提供最优质的解答。',
								botId: '7390662930620022824',
							}
					 ]
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			goChat(event) {
				console.log(event)
				uni.setStorageSync('chat-info', event)
				console.log(event)
				uni.navigateTo({
					url: '/pages/chat'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f1f4fa;
		height: 100vh;
		.top-title {
			width: 100%;
			height: 150rpx;
			padding: 30rpx 20rpx;

			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				font-size: 40rpx;
				color: #333;
				font-weight: 600;
			}
			.title-desc {
				font-size: 28rpx;
				color: #b2b2b2;
				margin-top: 8rpx;
			}
		}
		.mian-content {
			width: 100%;
			height: calc(100% - 240rpx);
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx 30rpx;
			.card-view {
				width: 100%;
				margin-bottom: 42rpx;
				.title-category {
					line-height: 60rpx;
					font-size: 34rpx;
					color: #333;
					font-weight: 600;

					&:before {
						content: ' ';
						display: inline-block;
						margin-right: 10rpx;
						height: 30rpx;
						width: 4rpx;
						background: #475cff;
						vertical-align: middle;
					}
				}
				.model-detail {
					margin-top: 16rpx;
					background-color: #FFF;
					border-radius: 12rpx;

					display: flex;
					flex-direction: column;
					align-items: center;
					.name-header {
						width: 100%;
						border-bottom: 2rpx #efefef solid;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 20rpx;
						.left {
							display: flex;
							align-items: center;
							image {
								border-radius: 8rpx;
								width: 70rpx;
								height: 70rpx;
								margin-right: 16rpx;
							}
							text {
								font-size: 28rpx;
								color: #999;
								font-weight: 500;
							}
						}
						.right {
							font-size: 24rpx;
							color: #b2b2b2;
						}
					}
					.content-desc {
						width: 100%;
						padding: 20rpx;
						text {
							font-size: 26rpx;
							line-height: 46rpx;
							color: #000;
							font-weight: 500;
						}
					}
				}
			}
		}
		.bottom-desc {
			width: 100%;
			height: 90rpx;
			font-size: 28rpx;
			color: #b2b2b2;

			display: flex;
			flex-direction: column;
			align-items: center;

			line-height: 40rpx;
		}
	}
</style>
