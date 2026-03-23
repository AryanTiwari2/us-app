import React, { useState, useEffect, useRef } from "react";
import ThemePicker from "./ThemePicker";
import Cookies from "universal-cookie";
import { apiConfig, cookieName } from "../constants";
import { colorMap } from "../constants";
import axios from "axios";


const ProfilePages = ({ profileUser, userName, setLoading, setCurrPage }) => {
  const cookies = new Cookies();
  const [roomNameFromApi, setRoomNameFromApi] = useState('');
  const [userTypeFromApi, setUserTypeFromApi] = useState('');
  const [userTheme, setUserTheme] = useState('');
  const [gender, setGender] = useState('');
  const [userNameFromApi, setUserNameFromApi] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [instagram, setInstagram] = useState("");
  const [github, setGithub] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [backgroundColor, setBackgroudColor] = useState('pink');
  const [textColor, setTextColor] = useState('#FFF8F9');

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getProfileOfUser = async () => {
    try {
      const token = cookies.get(cookieName.authToken);
      const config = {
        url: apiConfig.backendbaseUrl + apiConfig.path.getUserProfile + '/' + (profileUser || userName),
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
      }
      const response = await axios(config)
      return response.data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const updateProfileForTheUser = async () => {
    try {
      const token = cookies.get(cookieName.authToken);
      const config = {
        url: apiConfig.backendbaseUrl + apiConfig.path.updateProfile,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        data: {
          name: name,
          gender: getGenderValue(gender),
          description: description,
        }
      }
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const updateProfile = async () => {
    setLoading(true);
    const responseBody = await updateProfileForTheUser();
    setLoading(false);
    if (!responseBody) {
      setCurrPage('chat');
      return;
    }
    setUserNameFromApi(responseBody["username"]);
    setUserTypeFromApi(responseBody["userType"]);
    setRoomNameFromApi(responseBody["roomName"]);
    setGender(setGenderOfTheUser(responseBody["gender"]));
    setDescription(responseBody["description"]);
    setName(responseBody["name"]);
    setImage(getProperImageName(responseBody["image"]));
    setSocialLinks(responseBody["socialLink"]);
    setUserTheme(responseBody["themeColor"]);
    const colorEntry = colorMap[responseBody["themeColor"]] || colorMap['primary'];
    const background = colorEntry.background;
    const textCol = colorEntry.textColor;
    setBackgroudColor(background);
    setTextColor(textCol);
  }

  const setGenderOfTheUser = (gender) => {
    if (gender == 'M') return 'He';
    else if (gender == 'F') return 'She';
    else return 'He/She';
  }

  const getGenderValue = (gender) => {
    if (gender == 'He') return 'M';
    else if (gender == 'She') return 'F';
    else return 'M';
  }

  const getProperImageName = (image) => {
    if (image == null) return 'https://picsum.photos/200/200';
    return image;
  }

  const setSocialLinks = (socialLinks) => {
    const pairs = socialLinks.split(";").filter(Boolean);
    pairs.forEach((pair) => {
      const [key, value] = pair.split(":");
      switch (key) {
        case "instagram":
          setInstagram(value);
          break;
        case "github":
          setGithub(value);
          break;
        case "facebook":
          setFacebook(value);
          break;
        case "twitter":
          setTwitter(value);
          break;
        default:
          break;
      }
    });
  }

  const fetchUserProfileData = async () => {
    setLoading(true);
    const responseBody = await getProfileOfUser();
    setLoading(false);
    if (!responseBody) {
      setCurrPage('chat');
      return;
    }
    setUserNameFromApi(responseBody["username"]);
    setUserTypeFromApi(responseBody["userType"]);
    setRoomNameFromApi(responseBody["roomName"]);
    setGender(setGenderOfTheUser(responseBody["gender"]));
    setDescription(responseBody["description"]);
    setName(responseBody["name"]);
    setImage(getProperImageName(responseBody["image"]));
    setSocialLinks(responseBody["socialLink"]);
    setUserTheme(responseBody["themeColor"]);
    const colorEntry = colorMap[responseBody["themeColor"]] || colorMap['primary'];
    const background = colorEntry.background;
    const textCol = colorEntry.textColor;
    setBackgroudColor(background);
    setTextColor(textCol);
  }

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  return (
    <div className="rounded-xs flex justify-center h-full" style={{ background: backgroundColor }}>
      <div className="mt-4 w-full">
        <div className="flex items-center justify-center p-6 rounded-lg max-w-xl">

          {/* Profile Picture */}
          <div className="flex flex-col items-center z-10" style={{ minWidth: '112px' }}>
            <img
              src={image}
              className="md:h-32 md:w-32 h-28 w-28 rounded-full object-cover cursor-pointer"
              style={{ border: `4px solid #FFF8F9` }}
              alt="profile"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <p
              className="permanent-marker-ultralight text-[10px] cursor-pointer"
              style={{ color: textColor }}
              onClick={() => fileInputRef.current.click()}
            >
              Change picture
            </p>
          </div>

          {/* Name & Gender — fixed height so layout never shifts */}
          <div
            className="flex flex-col justify-center ml-1"
            style={{ minWidth: 0, flex: 1, minHeight: '110px' }}
          >

            {/* Edit name / Save toggle — same position, just text changes */}
            <p
              className="permanent-marker-ultralight text-[10px] cursor-pointer mb-1 text-right self-end"
              style={{ color: textColor }}
              onClick={() => {
                if (isEditingName) {
                  updateProfile();
                  setIsEditingName(false);
                } else {
                  setIsEditingName(true);
                }
              }}
            >
              {isEditingName ? 'Save ✓' : 'Edit name'}
            </p>

            {/* Name box — fixed height, never collapses */}
            <div
              className="rounded-xl px-4 py-3 ml-[-20px] cursor-pointer"
              style={{
                background: textColor,
                color: backgroundColor,
                minHeight: '52px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isEditingName ? (
                <input
                  className="font-bold permanent-marker-regular outline-none bg-transparent w-full text-lg md:text-2xl"
                  style={{ color: backgroundColor }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              ) : (
                <h1
                  className="font-bold permanent-marker-regular text-lg md:text-2xl w-full"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name}
                </h1>
              )}

            </div>

            {/* Gender — always reserve space, never shifts layout */}
            <div style={{ minHeight: '28px', display: 'flex', alignItems: 'center' }}>
              {isEditingGender ? (
                <div className="flex items-center gap-2">
                  <select
                    className="permanent-marker-ultralight rounded px-2 py-1 outline-none text-[12px]"
                    style={{
                      background: textColor,
                      color: backgroundColor,
                      border: 'none',
                    }}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    autoFocus
                  >
                    <option value="He">He</option>
                    <option value="She">She</option>
                  </select>
                  <button
                    className="text-[10px] permanent-marker-ultralight"
                    style={{ color: textColor }}
                    onClick={() => {
                      updateProfile();
                      setIsEditingGender(false);
                    }}
                  >
                    Save ✓
                  </button>
                </div>
              ) : (
                <p
                  className="permanent-marker-ultralight text-[10px] cursor-pointer"
                  style={{ color: textColor }}
                  onClick={() => setIsEditingGender(true)}
                >
                  {gender} ✎
                </p>
              )}
            </div>

          </div>
        </div>

        <div className="w-full h-1" style={{ background: textColor }}></div>

        <div className="flex flex-col items-center">
          <p className="text-[24px] permanent-marker-light" style={{ color: textColor }}>
            <span className="permanent-marker-regular">Username :</span> {userNameFromApi}
          </p>
          <p className="text-[24px] permanent-marker-light" style={{ color: textColor }}>
            <span className="permanent-marker-regular">Room :</span> {roomNameFromApi}
          </p>

          {/* About Me */}
          <div className="relative flex flex-col justify-center items-center ml-2 mr-2 mt-4 w-full max-w-lg">
            <h2
              className="text-lg font-bold w-full px-6 py-2 text-center rounded-t-lg permanent-marker-light flex items-center justify-center gap-2"
              style={{ background: textColor, color: backgroundColor }}
            >
              About me
              <i
                className="fa-solid fa-pen text-sm cursor-pointer"
                onClick={() => setIsEditingAbout(true)}
              ></i>
            </h2>
            <div
              className="w-full rounded-b-lg px-4 pb-4 pt-4"
              style={{ background: backgroundColor, border: `1px solid ${textColor}` }}
            >
              {isEditingAbout ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full text-sm permanent-marker-ultralight rounded p-2 outline-none resize-none"
                    style={{ background: textColor, color: backgroundColor, minHeight: '80px' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="text-[12px] permanent-marker-ultralight self-end"
                    style={{ color: textColor }}
                    onClick={() => {
                      updateProfile();
                      setIsEditingAbout(false);
                    }}
                  >
                    Save ✓
                  </button>
                </div>
              ) : (
                <p
                  className="text-sm permanent-marker-ultralight cursor-pointer"
                  style={{ color: textColor }}
                  onClick={() => setIsEditingAbout(true)}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <p className="text-[24px] permanent-marker-regular mt-4" style={{ color: textColor }}>You can find me:</p>

          <div className="flex space-x-6 mt-4 mb-6">
            <a href={twitter} className="text-3xl float" style={{ color: textColor }}>
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href={instagram} className="text-3xl float" style={{ color: textColor }}>
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href={github} className="text-3xl float" style={{ color: textColor }}>
              <i className="fa-brands fa-github"></i>
            </a>
            <a href={facebook} className="text-3xl float" style={{ color: textColor }}>
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </div >
  )
}
export default ProfilePages;