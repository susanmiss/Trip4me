import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";


class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            redirectToHome: false,
            error: "",
            fileSize: 0,
            loading: false
        };
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ redirectToHome: true });
            } else {
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    error: ""
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 1000000000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        if (title.length < 4 || title.length > 40 ) {
            this.setState({ error: "Title must be between 4 and 40 characters", loading: false });
            return false;
        }
        if (body.length < 4 || body.length > 3000) {
            this.setState({ error: "Body must be between 4 and 3000 characters", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    handleChangeInt = name => event => {
        this.setState({ error: "" });
        const value = name === "photoInt" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photoInt" ? event.target.files[0].size : 0;

        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });

        console.log(value)

    };

    handleChangeInt1 = name => event => {
      this.setState({ error: "" });
      const value = name === "photoIntOne" ? event.target.files[0] : event.target.value;

      const fileSize = name === "photoIntOne" ? event.target.files[0].size : 0;

      this.postData.set(name, value);
      this.setState({ [name]: value, fileSize });

      console.log(value)
    };


    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const postId = this.props.match.params.postId;
            const token = isAuthenticated().token;

            update(postId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        redirectToHome: true
                    });
                }
            });
        }
    };

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>


            <div className="form-group">

                <label className="text-muted">Post Internal Photo</label>
                <input
                    onChange={this.handleChangeInt("photoInt")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>


            <div className="form-group">
                <label className="text-muted">Post Internal Photo</label>
                <input
                    onChange={this.handleChangeInt1("photoIntOne")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update Post
            </button>
        </form>
    );

    render() {
        const {
            id,
            title,
            body,
            redirectToHome,
            error,
            loading
        } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        }

        return (
            <div className="container" style={{marginTop: "100px", marginBottom: "150px"}}>
                <h2 className="mt-5 mb-5">{title}</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ""
                )}

                <img
                    style={{ width: "auto", maxHeight:"350px" }}
                    className="img-thumbnail"
                    src={`${
                        process.env.REACT_APP_API_URL
                    }/post/photo/${id}?${new Date().getTime()}`}

                    alt={title}
                />


                {isAuthenticated().user.role === "admin" &&
                    this.editPostForm(title, body)}

            </div>
        );
    }
}

export default EditPost;
