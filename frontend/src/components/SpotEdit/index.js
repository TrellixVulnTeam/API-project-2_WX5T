import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./spotEdit.css";
const EditSpot = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = Number(spotId);
  const spot = useSelector((state) => state.spots[spotId]);
  const [name, setName] = useState(spot?.name);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [country, setCountry] = useState(spot?.country);
  const [latitude, setLatitude] = useState(spot?.latitude);
  const [longitude, setLongitude] = useState(spot?.longitude);
  const [description, setDescription] = useState(spot?.description);
  const [price, setPrice] = useState(spot?.price);
  const [previewImage, setPreviewImage] = useState(spot?.previewImage);
  const [errors, setErrors] = useState([]);

  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateCountry = (e) => setCountry(e.target.value);
  const updateLatitude = (e) => setLatitude(e.target.value);
  const updateLongitude = (e) => setLongitude(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updatePreviewImage = (e) => setPreviewImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    let data = {
      address,
      city,
      state,
      country,
      previewImage,
      latitude,
      longitude,
      name,
      description,
      price,
      spotId
    };

    return dispatch(spotActions.spotEdit(data,spot.id))
    .then(() => {
      history.push(`/spots/${spot.id}`)
      // <Redirect to={`/spots/${}`} />
    })
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });

  };

  return (
    <div className="editFormDiv">
    <form className="editSpotForm" onSubmit={handleSubmit}>
      <h2 className="editSpot"> Edit Your Home </h2>
      {errors ?? (
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      )}
      <div>
        <label>Name:</label>
        <input
          type="text"
          placeholder="Spot name"
          value={name}
          onChange={updateName}
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={updateAddress}
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={updateCity}
        />
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={updateState}
        />
      </div>
      <div>
        <label>Country:</label>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={updateCountry}
        />
      </div>
      <div>
      <label>
      Latitude
      </label>
      <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={updateLatitude}
      />
      </div>
      <div>
      <label>
      Longitude
      </label>
      <input
        type="text"
        placeholder="Longitude"
        value={longitude}
        onChange={updateLongitude}
      />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={updateDescription}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="text"
          value={price}
          placeholder="Price"
          onChange={updatePrice}
        />
      </div>
      <div>
        <label>Image:</label>
        <input
          type="text"
          placeholder="img-url"
          value={previewImage}
          onChange={updatePreviewImage}
        />
      </div>
      <div className="buttonContainer">
      <button className="confirmEditButton" type="submit">
        Confirm Edit
      </button>
      </div>
    </form>
  </div>
);
};


export default EditSpot;
