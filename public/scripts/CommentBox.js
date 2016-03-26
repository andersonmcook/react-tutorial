// let data = [
//   {id: 1, author: "Pete Hunt", text: "This is one comment"},
//   {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
// ];
//
const CommentBox = React.createClass({
  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  handleCommentSubmit: function (comment) {
    const comments = this.state.data
    comment.id = Date.now()
    const newComments = comments.concat([comment])
    this.setState({data: newComments})
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        this.setState({data: comments})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {data: []}
  },
  componentDidMount: function () {
    this.loadCommentsFromServer()
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  render: function () {
    return (
      <div className='commentBox'>
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    )
  }
})
//
const CommentList = React.createClass({
  render: function () {
    const commentNodes = this.props.data.map(comment => {
      return (
        <Comment author={comment.author} key={comment.id}>{comment.text}</Comment>
      )
    })
    return (
      <div className='commentList'>
        {commentNodes}
      </div>
    )
  }
})
//
const CommentForm = React.createClass({
  getInitialState: function () {
    return {author: '', text: ''}
  },
  handleAuthorChange: function (event) {
    this.setState({author: event.target.value})
  },
  handleTextChange: function (event) {
    this.setState({text: event.target.value})
  },
  handleSubmit: function (event) {
    event.preventDefault()
    const author = this.state.author.trim()
    const text = this.state.text.trim()
    if (!author || !text) {
      return
    }
    this.props.onCommentSubmit({author: author, text: text})
    this.setState({author: '', text: ''})
  },
  render: function () {
    return (
      <form className='commentForm' onSubmit={this.handleSubmit}>
        <input type='text' placeholder='Your name' value={this.state.author} onChange={this.handleAuthorChange}/>
        <input type='text' placeholder='Say something' value={this.state.text} onChange={this.handleTextChange}/>
        <input type='submit' value='Post'/>
      </form>
    )
  }
})
//
const Comment = React.createClass({
  render: function () {
    return (
      <div className='comment'>
        <h2 className='commentAuthor'>{this.props.author}</h2>
        {this.props.children}
      </div>
    )
  }
})


// ReactDOM.render(<CommentBox data={data}/>, document.getElementById('content'))
ReactDOM.render(<CommentBox url='/api/comments' pollInterval={2000}/>, document.getElementById('content'))
