import React, { Component } from 'react'
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core"


const mapStateToProps = (state, ownProps) => {
  return {
    error: state.cards.error,
    list: state.cards.items,
    loading: state.cards.loading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};

const styles = theme => ({

})



class Results extends Component {


  render() {

    const { classes, list, error, loading } = this.props

    if (error) {
      return (
        <div>
          <p>Error</p>
          <p>{JSON.stringify(error)}</p>
        </div>
      );
    }

    if (loading) {
      return <p>Loading..</p>;
    }

    return (
      list.map(card => {
        return <img src={card.image_uris.small} />
      })
    )
  }
}


const StatefulResults = connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);

export default withStyles(styles)(StatefulResults);