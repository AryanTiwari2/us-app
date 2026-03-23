import React, { useState, useEffect, useRef } from "react";
import ThemePicker from "./ThemePicker";
import Cookies from "universal-cookie";
import { apiConfig, cookieName } from "../constants";
import { colorMap } from "../constants";
import axios from "axios";


const ProfilePages = ({ profileUser, userName, setLoading, setCurrPage, getSignOut, setColor }) => {
  const cookies = new Cookies();
  const [roomNameFromApi, setRoomNameFromApi] = useState('');
  const [userTypeFromApi, setUserTypeFromApi] = useState('');
  const [userTheme, setUserTheme] = useState('pink');
  const [gender, setGender] = useState('');
  const [userNameFromApi, setUserNameFromApi] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://picsum.photos/200/200');
  const [backgroundColor, setBackgroudColor] = useState('pink');
  const [textColor, setTextColor] = useState('#FFF8F9');

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const fileInputRef = useRef(null);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialValues, setSocialValues] = useState({ twitter: "", instagram: "", github: "", facebook: "" });

  const socials = [
    { key: 'twitter', icon: 'fa-brands fa-twitter' },
    { key: 'instagram', icon: 'fa-brands fa-instagram' },
    { key: 'github', icon: 'fa-brands fa-github' },
    { key: 'facebook', icon: 'fa-brands fa-facebook' },
  ];

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
      getSignOut();
      return;
    }
  }

  const updateProfileForTheUser = async () => {
    try {
      if (userNameFromApi !== userName) return;
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
          themeColor: userTheme,
          socialLink: transformSocialLinks()
        }
      }
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.log(error);
      getSignOut();
      return;
    }
  }

  const updateProfile = async () => {
    if (userNameFromApi !== userName) return;
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
    setColor(responseBody["themeColor"]);
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
    const pairs = socialLinks.split("++").filter(Boolean);
    pairs.forEach((pair) => {
      const [key, value] = pair.split("->");
      switch (key) {
        case "instagram":
          setSocialValues(prev => ({ ...prev, instagram: value }));
          break;
        case "github":
          setSocialValues(prev => ({ ...prev, github: value }));
          break;
        case "facebook":
          setSocialValues(prev => ({ ...prev, facebook: value }));
          break;
        case "twitter":
          setSocialValues(prev => ({ ...prev, twitter: value }));
          break;
        default:
          break;
      }
    });
  }

  const transformSocialLinks = () => {
    return `${socialValues.instagram ? `instagram->${socialValues.instagram}` : ''}${socialValues.github ? `++github->${socialValues.github}` : ''}${socialValues.facebook ? `++facebook->${socialValues.facebook}` : ''}${socialValues.twitter ? `++twitter->${socialValues.twitter}` : ''}`;
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
    setColor(responseBody["themeColor"]);
  }

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setEditingSocial(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={userNameFromApi === userName ? handleImageChange : () => { }}
            />
            <p
              className="permanent-marker-ultralight text-[10px] cursor-pointer"
              style={{ color: textColor }}
              onClick={() => { if (userNameFromApi === userName) fileInputRef.current.click() }}
            >
              {userNameFromApi === userName ? "Change picture" : "View picture"}
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
              style={{
                color: textColor,
                visibility: userNameFromApi === userName ? 'visible' : 'hidden',
              }}
              onClick={() => {
                if (userNameFromApi !== userName) return;
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
                  onClick={() => userNameFromApi === userName && setIsEditingGender(true)}
                >
                  {gender} {userNameFromApi === userName && '✎'}
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
              {userNameFromApi === userName && <i
                className="fa-solid fa-pen text-sm cursor-pointer"
                onClick={() => setIsEditingAbout(true)}
              ></i>}
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
                  onClick={() => userNameFromApi === userName && setIsEditingAbout(true)}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <p className="text-[24px] permanent-marker-regular mt-4" style={{ color: textColor }}>You can find me:</p>
          <div ref={popupRef} className="flex space-x-6 mt-4 mb-6 relative">
            {socials.map(({ key, icon }) => (
              <div key={key} className="relative">
                <i
                  className={`${icon} text-3xl cursor-pointer float`}
                  style={{ color: textColor }}
                  onClick={() => {
                    if (userNameFromApi === userName) {
                      setEditingSocial(editingSocial === key ? null : key);
                    } else if (socialValues[key]) {
                      window.open(socialValues[key], '_blank');
                    }
                  }}

                />

                {editingSocial === key && (
                  <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-xl p-3 flex flex-col gap-2 z-50"
                    style={{
                      background: textColor,
                      border: `1px solid ${backgroundColor}`,
                      minWidth: '180px',
                    }}
                  >
                    {socialValues[key] && (
                      <a
                        href={socialValues[key]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] permanent-marker-light flex items-center gap-2"
                        style={{ color: backgroundColor }}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" />
                        Visit
                      </a>
                    )}

                    {socialValues[key] && (
                      <div style={{ height: '0.5px', background: backgroundColor, opacity: 0.3 }} />
                    )}
                    <input
                      className="text-[11px] permanent-marker-ultralight outline-none rounded px-2 py-1 w-full"
                      style={{ background: backgroundColor, color: textColor }}
                      placeholder={`${key} URL`}
                      value={socialValues[key] || ''}
                      onChange={(e) => setSocialValues({ ...socialValues, [key]: e.target.value })}
                    />

                    <button
                      className="text-[11px] permanent-marker-light self-end px-2 py-1 rounded"
                      style={{ background: backgroundColor, color: textColor }}
                      onClick={() => {
                        updateProfile();
                        setEditingSocial(null);
                      }}
                    >
                      Save ✓
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {userTheme && userNameFromApi === userName && <ThemePicker
          backgroundColor={backgroundColor}
          textColor={textColor}
          setUserTheme={setUserTheme}
          updateProfile={updateProfile}
          setBackgroudColor={setBackgroudColor}
          setTextColor={setTextColor}
          userTheme={userTheme}
          popupRef={popupRef}
        ></ThemePicker>}
      </div>
    </div >
  )
}
export default ProfilePages;