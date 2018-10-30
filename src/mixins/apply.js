export default {
    methods: {
        submitForm() {
            for (let index = 0; index < this.checkItems.length; index++) {
                const element = this.checkItems[index];
                if (element.images.length == 0) {
                    let arr = []
                    //判断对应审核项是否有历史记录
                    for (let key = 0; key < this.history.length; key++) {
                        const ele = this.history[key];
                        if(ele.check_item_id == element.id){
                            arr.push(ele)
                        }
                    }
                    if(arr.length == 0){
                        this.$vux.toast.text('请上传' + element.name + '相关资料');
                        return;
                    }
                }
            }
            this.$nextTick(() => {
                this.submitBtnDisabled = true
                this.$vux.loading.show()
                console.log(this.checkItems)
                this.$http.post('patient/check-upload', { checkItems: this.checkItems })
                    .then(response => {
                        console.log(response)
                        if (response.data.status == 'success') {
                            this.$vux.loading.hide()
                            // this.$vux.toast.text('上传成功')
                            this.$router.push(this.redirectUrl)
                        } else {
                            this.$vux.toast.text(response.data.message);
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.submitBtnDisabled = false
                        this.$vux.loading.hide()
                    });
            })
        },
    }
}