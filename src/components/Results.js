import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { AutoSizer, List } from 'react-virtualized';

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

const styles = theme => ({
  List: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    position: 'relative'
  },
  ListItem: {
    paddingRight: 96
  }
});

class Results extends Component {
  render() {
    const { classes, list, error, loading } = this.props;

    const _renderRow = ({
      key, // Unique key within array of rows
      index, // Index of row within collection
      isScrolling, // The List is currently being scrolled
      isVisible, // This row is visible within the List (eg it is not an overscanned row)
      style // Style object to be applied to row (to position it)
    }) => {
      // get card
      const card = list[index];

      if (!isVisible) {
        return (
          <div style={style}>
            <Typography>Loading...</Typography>
          </div>
        );
      }

      // return row
      return (
        <div style={style}>
          <ListItem key={card.id} className={classes.ListItem}>
            <ListItemText
              // primary={`${card.name} - ${card.type_line}`}
              primary={
                <Typography>
                  {card.name}{' '}
                  <Typography variant="caption">{card.type_line}</Typography>
                </Typography>
              }
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
        </div>
      );
    };

    if (error) {
      return (
        <div>
          <p>Error</p>
          <p>{JSON.stringify(error)}</p>
        </div>
      );
    }

    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={classes.List}
            height={300}
            width={width}
            width={width}
            overscanRowCount={20}
            rowCount={list.length}
            rowHeight={72}
            rowRenderer={_renderRow}
          />
        )}
      </AutoSizer>
    );
  }
}

const StatefulResults = connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);

export default withStyles(styles)(StatefulResults);
