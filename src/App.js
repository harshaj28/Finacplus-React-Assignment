import React, { useState,useEffect } from 'react';
import "./App.css"
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';
import {
  Modal,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListSubheader,
  Button,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow:'auto'
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  commentInput: {
    width: '100%',
  },
}));

function CommentModal(props) {
  const classes = useStyles();
  const { open, onClose, people } = props;
  const [commentText, setCommentText] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://mocki.io/v1/b0c7d7ea-5d09-4b9c-8d4b-c1b40cc39bc9',
      );
      const newArray=result.data.comments.map((commentt)=>{
        const options = { year: "numeric", month: "long", day: "numeric",hour: 'numeric', hour12: true}
        const date= new Date(commentt.updatedOn).toLocaleDateString(undefined, options)
        const newComment = {
          id: comments.length + 1,
          loanId: 123456,
          comment:commentt.comment,
          date:  date,
          people:commentt.taggedTo,
          user:commentt.updatedBy
        };
        return newComment;
      })
      setComments(...comments,newArray)
    };
    fetchData();
  }, []);

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };

  const handlePersonSelect = (event) => {
    setSelectedPeople(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const options = { year: "numeric", month: "long", day: "numeric",hour: 'numeric', hour12: true}
    const date= new Date().toLocaleDateString(undefined, options)
    const newComment = {
      id: comments.length + 1,
      loanId: 123456,
      comment: commentText,
      date: date,
      people: selectedPeople,
    };
    console.log(newComment)
    setComments([...comments, newComment]);
    setCommentText('');
    setSelectedPeople([]);
  }

  return (
    <Modal open={open} onClose={onClose} className={classes.modal}>
      <Paper className={classes.paper}>
        <h2>Comments ({comments.length})</h2>
        <List>
          {comments.map((comment, index) => (
            <>
            <InitialsAvatar name={`${comment.user}`} />
            <ListItem key={index}>
              <ListItemText
                primary={comment.comment}
                secondary={
                  <>
                  <>
                    loanId:
                      <React.Fragment key={index}>
                        {index > 0 && ', '}
                        {comment.loanId}&nbsp;
                      </React.Fragment>
                  </>
                  <>
                  Tagged:
                  {comment.people?.map((person, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ', '}
                      {person}&nbsp;
                    </React.Fragment>
                  ))}
                 </>
                 <>
                 <br></br>
                  Date:
                    <React.Fragment key={index}>
                      {index > 0 && ', '}
                      {comment.date}
                    </React.Fragment>
                 </>
                </>
                }
              />
              
            </ListItem>
            </>
          ))}
        </List>
        <FormControl className={classes.commentInput}>
          <InputLabel htmlFor="comment-input">Add a comment</InputLabel>
          <Input
            id="comment-input"
            value={commentText}
            onChange={handleCommentTextChange}
            endAdornment={
            <InputAdornment position="end">
            <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleSubmit}
                        >
            <AddIcon />
            </IconButton>
            </InputAdornment>
            }
            />
        </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="people-select-label">Tag people</InputLabel>
              <Select
              labelId="people-select-label"
              id="people-select"
              multiple
              value={selectedPeople}
              onChange={handlePersonSelect}
              input={<Input />}
              renderValue={(selected) => selected.join(', ')}
              >
              <ListSubheader>Select people</ListSubheader>
              {people.map((person,id) => (
              <MenuItem key={id} value={person}>
                <Checkbox checked={selectedPeople.indexOf(person) > -1} />
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={person} />
              </MenuItem>
              ))}
              </Select>
            </FormControl>
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
      </Paper>
    </Modal>)}

export default function App() {
  const [open, setOpen] = useState(false);
  const people = ['Ethel Howard Daniel','John Doe','Johnson Daniel'];

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
      Open Comment Modal
      </Button>
      <CommentModal open={open} onClose={() => setOpen(false)} people={people} />
    </div>
  );
}
