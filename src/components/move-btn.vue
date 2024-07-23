<template>
	<view>
		<movable-area class="movable-area">
			<movable-view class="movable-view" :x="x" :y="y" direction="all">
				<view class="move-button padding-lr-sm" @click="$emit('click')">
					<image src="../static/clear-selected.png" mode="heightFix" style="height: 50%;"></image>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				x: 350,		//x坐标
				y: 120,		//y坐标
			}
		}
	}
</script>
 
<style lang="scss">
	$all_width: 96rpx;
	$all_height:96rpx;
 
	.movable-area {
		height: calc(100vh - 94rpx);
		width: 750rpx;
		top: 0;
		position: fixed;
		pointer-events: none;		//此处要加，鼠标事件可以渗透
		.movable-view {
			width: $all_width;
			height: $all_height;
			pointer-events: auto;	//恢复鼠标事件
			.move-button {
				width: $all_width;
				height: $all_height;
				display: flex;
				align-items: center;
				color: #FFF;
				background-color: #fff;
				border-radius: 50%;
				border: 1px #ccc solid;
			}
		}
	}
</style>