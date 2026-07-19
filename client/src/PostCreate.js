import React, {useState} from "react";
import axios from "axios";

const PostCreate = () => {
    const [title, setTitle] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://posts.com/posts/create', { title });
        
        setTitle(''); // Clear the input field after submission
    }

    return <div>
    <form onSubmit={onSubmit}>
        <div className="form-group">
            <label>Title</label>
            <input value={title} className="form-control" onChange={e => setTitle(e.target.value)}></input>
        </div>
        <button className="btn btn-primary">Submit</button> 
    </form>
    </div>;
};

export default PostCreate;