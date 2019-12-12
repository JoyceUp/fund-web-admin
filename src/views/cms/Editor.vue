<template>
    <div>
        <p style="color:red">上传的图片必须经过压缩，否则打开页面会很慢或打不开，推荐一个在线压缩地址：http://zhitu.isux.us/，支持批量压缩</p>
        <div ref="editor" id="editor" prop="html" style="text-align:left;"></div>
        <!-- <button v-on:click="getContent">查看内容</button>-->
    </div>
</template>

<script>
    import E from 'wangeditor'

    var editors
    export default {
        name: 'editor',
        props: ["contentHtml"],
        data() {
            return {

                editorContent: '',
                rules: {
                    html: [
                        {required: true, message: '文章内容不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {

            getContent: function () {
                alert(this.editorContent)
            },
            setEditor() {
                console.log(111)
                editors.txt.html(this.contentHtml)
            },
            initEditor() {
                editors = new E(this.$refs.editor)
//        editor.customConfig.uploadImgServer = '/common/upload'
                editors.customConfig.uploadImgShowBase64 = true
                editors.customConfig.onchange = (html) => {
                    this.editorContent = html
                    this.$emit('ievent', html);
                }
                editors.create()
                editors.txt.html(this.contentHtml)
            }
        },
        mounted() {
            this.initEditor()

        },
     /*   watch: {
            contentHtml: {
                handler(newValue, oldValue) {
                    this.setEditor()
                },
                deep: true
            }
        }*/


    }
</script>

<style>
    .w-e-text-container {
        height: 600px !important;
        resize: vertical;
    }
</style>
