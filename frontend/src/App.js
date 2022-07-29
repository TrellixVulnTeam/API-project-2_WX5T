import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormModal from "./components/LoginFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotDetail from "./components/SpotDetail";
import SpotsPage from "./components/Spots";
import NewSpotForm from "./components/SpotsForm";
import EditSpot from "./components/SpotEdit"
import UserSpots from "./components/UserSpots";
// import Reviews from "./components/Reviews"
import CreateReview from "./components/SpotDetail/createReview";
import Reviews from "./components/UserReviews";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotsPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/login">
            <LoginFormModal />
          </Route>
          <Route exact path="/spots/create">
            <NewSpotForm />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <EditSpot />
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotDetail />
          </Route>
          <Route exact path="/users/current/spots">
            <UserSpots />
          </Route>
          <Route exact path="/spots/:spotID/createReview">
            <CreateReview />
          </Route>
          <Route exact path="/user/reviews">
            <Reviews />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
