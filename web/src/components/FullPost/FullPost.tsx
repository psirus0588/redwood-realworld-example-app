import CommentList from '../CommentList/CommentList'
import CommentSubmitBox from '../CommentSubmitBox/CommentSubmitBox'
import PostMeta from '../PostMeta/PostMeta'
import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { CommentContextProvider } from 'src/misc/CommentContextProvider'
import MDEditor from '@uiw/react-md-editor'

const FullPost = ({ post }) => {
  const { isAuthenticated } = useAuth()
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{post?.title}</h1>
          <PostMeta post={post} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            {/* <p>
              Web development technologies have evolved at an incredible clip
              over the past few years.
            </p>
            <h2 id="introducing-ionic">Introducing RealWorld.</h2> */}
            <div className="container" data-color-mode="light">
              <MDEditor.Markdown
                source={post?.body}
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
            {post?.tagList?.length > 0 && (
              <ul className="tag-list">
                {post?.tagList?.map((tag) => (
                  <li
                    className="tag-default tag-pill tag-outline"
                    key={tag.name}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <PostMeta post={post} />
        </div>
        <div className="row">
          <CommentContextProvider>
            <div className="col-xs-12 col-md-8 offset-md-2">
              {isAuthenticated ? (
                <CommentSubmitBox article={post} />
              ) : (
                <p style={{ display: 'inherit' }}>
                  <Link to={routes.login()}>Sign in</Link>
                  {' or '}
                  <Link to={routes.register()}>Sign up</Link>
                  {' to add comments on this article.'}
                </p>
              )}
              <CommentList articleId={post?.id} />
            </div>
          </CommentContextProvider>
        </div>
      </div>
    </div>
  )
}

export default FullPost
