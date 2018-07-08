import '../assets/styles/footer.styl'

export default {
    data() {
        return {
            author: 'spock504',
            blog: 'https://github.com/spock504'
        }
    },
    render() {
        return (
            <div id="footer">
                <span>Power by {this.author}，欢迎访问作者博客：{this.blog}</span>
                <br/>
                <span>Hosted by Coding Pages</span>
            </div>
        )
    }
}