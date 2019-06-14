import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

const mapStateToProps = (state, ownProps) => {
  return {
    error: state.cards.error,
    list: state.cards.items,
    loading: state.cards.loading
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const styles = theme => ({});

class Results extends Component {
  render() {
    const { classes, list, error, loading } = this.props;

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
      <List>
        {list.map(card => {
          console.log(
            card.set_name,
            card.foil,
            card.prices.usd_foil,
            card.foil && card.prices.usd_foil
          );
          return (
            <ListItem key={card.id}>
              <ListItemText
                primary={`${card.name} - ${card.type_line}`}
                secondary={`${card.rarity} - ${card.set_name}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  edge="end"
                  aria-label="Add Foil"
                  disabled={!card.foil || card.prices.usd_foil === null}
                  onClick={() => {
                    console.log(`${card.name} - ${card.set_name}: Foil Added`);
                  }}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="secondary"
                  edge="end"
                  aria-label="Add NonFoil"
                  disabled={!card.nonfoil || card.prices.usd === null}
                  onClick={() => {
                    console.log(
                      `${card.name} - ${card.set_name}: Non Foil Added`
                    );
                  }}
                >
                  <Add />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );

          // return <img src={card.image_uris.small} />
        })}
      </List>
    );
  }
}

const StatefulResults = connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);

export default withStyles(styles)(StatefulResults);
