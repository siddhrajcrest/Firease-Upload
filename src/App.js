import "./App.css";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { db, messaging, storage } from "./firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function App() {
  const [users, setusers] = useState([]);
  const [data, setdata] = useState({});
  const [files, setfiles] = useState();
  const userCollection = collection(db, "users");
  useEffect(() => {
    getToken(messaging, { vapidKey: '6ttGM5UXRHdLg0VnKD0GBBoRCdq3NYAPNU4IKmtCMzk' }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
    const getUsers = async () => {
      const data = await getDocs(userCollection);
      setusers(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      console.log(users);
    };
    getUsers();
    return () => { };
  }, []);

  const addUser = async () => {
    await addDoc(userCollection, data);
  };
  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };
  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };
  // const handleUpload = () => {
  //   const fileName = new Date().getTime() + files.name;
  //   const storageRef = ref(storage, `/images/${fileName}`);
  //   const uploadTask = uploadBytesResumable(storageRef, files);
  //   uploadTask.on(
  //     (snapshot) => {
  //       const uploaded =
  //         Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       // getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //       //   console.log(url);
  //       // });
  //       uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
  //         console.log("File available at", downloadURL);
  //       });
  //     }
  //   );
  // };

  const handleUpload = () => {
    const fileName = new Date().getTime() + files.name;
    const storageRef = ref(storage, `/images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, files);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploaded = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  };
  return (
    <div className="App">
      <input
        placeholder="Name..."
        onChange={(e) => setdata({ ...data, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age..."
        onChange={(e) => setdata({ ...data, age: e.target.value })}
      />

      <button onClick={addUser}>Create user</button>
      {users.map((user, i) => {
        return (
          <>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>{" "}
            <button onClick={() => updateUser(user.id, user.age)}>
              increase age
            </button>
            <button onClick={() => deleteUser(user.id)}>Delete User</button>
          </>
        );
      })}
      <input
        type="file"
        onChange={(e) => setfiles(e.currentTarget.files[0])}
      ></input>
      <button onClick={() => handleUpload()}>Upload</button>
    </div>
  );
}

export default App;
