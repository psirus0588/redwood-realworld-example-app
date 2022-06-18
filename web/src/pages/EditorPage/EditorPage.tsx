import { Link, routes } from '@redwoodjs/router'
import {
  Form,
  TextField,
  TextAreaField,
  Submit,
  FieldError,
  FormError,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'
import slugify from 'slugify'
import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'

const CREATE_ARTICLE = gql`
  mutation CreateArticleMutation($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
    }
  }
`

const EditorPage = ({ slug }) => {
  const formMethods = useForm()
  const { currentUser } = useAuth()
  const [tagSet, setTagSet] = useState(new Set())
  const [create, { loading, error }] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      toast.success('Thank you for your article!')
      formMethods.reset()
      setTagSet(new Set())
    },
  })
  const onSubmit = (input) => {
    input.authorId = currentUser?.id
    input.slug = `${slugify(input.title)}-${input.authorId}`
    input.tagList = [...tagSet]
    create({
      variables: { input: input },
    })
    console.log(input)
  }
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <Toaster />
            <Form
              onSubmit={onSubmit}
              formMethods={formMethods}
              error={error}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
            >
              <FormError
                error={error}
                wrapperClassName="form-error rw-input-error"
              />
              <fieldset>
                <fieldset className="form-group">
                  <TextField
                    name="title"
                    validation={{ required: true }}
                    errorClassName="form-control form-control-lg rw-input-error"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                  />
                  <FieldError name="title" className="rw-field-error" />
                </fieldset>

                <fieldset className="form-group">
                  <TextField
                    name="description"
                    validation={{ required: true }}
                    errorClassName="form-control form-control-lg rw-input-error"
                    className="form-control"
                    placeholder="What's this article about?"
                  />
                  <FieldError name="description" className="rw-field-error" />
                </fieldset>

                <fieldset className="form-group">
                  <TextAreaField
                    name="body"
                    validation={{ required: true }}
                    errorClassName="form-control form-control-lg rw-input-error"
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                  ></TextAreaField>
                  <FieldError name="body" className="rw-field-error" />
                </fieldset>

                <fieldset className="form-group">
                  <TextField
                    name="tagList"
                    className="form-control"
                    placeholder="Enter tags"
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        setTagSet(new Set(tagSet.add(e.target.value)))
                        e.target.value = ''
                      }
                    }}
                  />
                  <div className="tag-list">
                    {[...tagSet].map((tag) => (
                      <span className="tag-default tag-pill" key={tag}>
                        <i
                          className="ion-close-round"
                          onKeyUp={() => {}}
                          role="link"
                          tabIndex={0}
                          onClick={() => {
                            tagSet.delete(tag)
                            setTagSet(new Set(tagSet))
                          }}
                        ></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>

                <Submit
                  disabled={loading}
                  className="btn btn-lg pull-xs-right btn-primary"
                >
                  Publish Article
                </Submit>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
