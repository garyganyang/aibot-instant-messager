const _uni = {
  showToast: (msg) => {
    uni.showToast({
      title: msg,
      icon: 'none',
      mask: true
    })
  }
}

export default _uni
