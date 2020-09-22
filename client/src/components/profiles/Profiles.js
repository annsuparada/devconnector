import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import ProfileItem from "./profileItem";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";

const Profiles = ({ getProfiles, profiles, loading }) => {
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>
          <div>
            {console.log(profiles)}
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profile.profiles,
  loading: state.profile.loading,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
