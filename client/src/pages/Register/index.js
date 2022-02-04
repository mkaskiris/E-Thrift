import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { postRegister, postLogin } from "../../helpers/requests";
import defaultProfileImg from "../../../assets/default-profile.png";
import "./style.css";

const Register = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [avatarImg, setAvatarImg] = useState();
  const [previewImg, setPreviewImg] = useState(defaultProfileImg);

  const navigate = useNavigate();
  const fileInputRef = useRef();

  const openFiles = e => {
    e.preventDefault();
    fileInputRef.current.click();
  }

  const onFileSelected = e => {
    const file = e.target.files[0];
    // assert that selected file is an image
    if (file && file.type.substr(0, 5) === "image") {
      setAvatarImg(file);
    } else {
      setAvatarImg(defaultProfileImg);
    }
  }

  const submitRegister = async (e) => {
    try {
      e.preventDefault();

      const data = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        phoneNumber: phoneNumber,
        avatarImg: avatarImg
      }
      // register the user
      await postRegister(data);
      // log the user in upon successful register
      await requestLogin();
    } catch (err) {
      console.warn(`Error registering user: ${err}`);
    }
  }

    /**
   * Requests an authorized log in. Sets local storage user variables
   * upon success and navigates to the home page.
   */
     async function requestLogin() {
      try {
        // obtain access and refresh tokens
        const { accessToken, refreshToken } = await postLogin({
          email,
          password,
        });
        const user = jwt_decode(accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("email", user.username);
        navigate('/');
      } catch (err) {
        console.warn(`Error requesting login: ${err}`);
      }
    }

  useEffect(() => {
    if (avatarImg) {
      const reader = new FileReader();
      // set the preview image once avatarImg url has been read
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      }
      reader.readAsDataURL(avatarImg);
    } else {
      setPreviewImg(defaultProfileImg);
    }
  }, [avatarImg])

  return (
    <div className="register-page">
      <form onSubmit={submitRegister}>
        <img src={previewImg} alt="Profile" onClick={e => openFiles(e)}/>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="profile-img"
          aria-label="profile-input"
          alt="Input Profile Image"
          onChange={e => onFileSelected(e)}
        />
        <label label="first-name" aria-label="first-name">
          First name
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label label="last-name" aria-label="last-name">
          Last name
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label label="username" aria-label="username">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label label="email" aria-label="email">
          Email address
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label label="password" aria-label="password">
          Password
        </label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label label="password-confirm" aria-label="password-confirm">
          Confirm password
        </label>
        <input
          type="text"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        <label label="phone-number" aria-label="phone-number">
          Phone number
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input type="submit" id="register-btn" className="submit-btn" input="Create your E-Thrift account" />
      </form>
    </div>
  );
};

export default Register;
