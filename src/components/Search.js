import React, { Component } from 'react';
import { connect } from 'react-redux';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import classNames from 'classnames';
import {
  withStyles,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Paper
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { setSearch } from '../actions/Search';
import { fetchCatalog } from '../actions/Catalog';
import { setSuggestions } from '../actions/Suggestions';
import { fetchCards } from '../actions/Cards';

const mapStateToProps = (state, ownProps) => {
  return {
    search: state.search,
    error: state.catalog.error,
    catalog: state.catalog.items,
    loading: state.catalog.loading,
    suggestions: state.suggestions
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSearch: value => {
      dispatch(setSearch(value));
    },
    initCatalog: () => {
      dispatch(fetchCatalog());
    },
    setSuggestions: suggestions => {
      dispatch(setSuggestions(suggestions));
    },
    fetchCards: cardname => {
      dispatch(fetchCards(cardname));
    }
  };
};

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, clear, ...other } = inputProps;

  const onClick = () => {
    console.log('renderInputComponent', 'onClick');
    setSearch('');
  };

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" aria-label="Clear Input" onClick={clear}>
              <Clear />
            </IconButton>
          </InputAdornment>
        )
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, catalog) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : catalog.filter(item => {
        const keep =
          count < 5 && item.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(item) {
  return item;
}

const styles = theme => ({
  root: {
    // height: 250,
    flexGrow: 1
  },
  container: {
    position: 'relative'
  },
  input: {
    margin: theme.spacing(1)
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  divider: {
    height: theme.spacing(2)
  }
});

class Search extends Component {
  state = {
    anchorEl: null,
    // suggestion: [],
    single: '',
    popper: ''
  };

  componentDidMount() {
    this.props.initCatalog();
  }

  render() {
    const {
      classes,
      search,
      setSearch,
      error,
      loading,
      catalog,
      suggestions
    } = this.props;

    const handleSuggestionsFetchRequested = ({ value }) => {
      this.props.setSuggestions(getSuggestions(value, catalog));
    };

    const handleInputClearRequested = () => {
      this.props.setSearch('');
      this.props.setSuggestions([]);
    };
    const handleSuggestionsClearRequested = () => {
      this.props.setSuggestions([]);
    };

    const handleSuggestionSelected = (event, { suggestion }) => {
      if (suggestion !== '') {
        this.props.fetchCards(suggestion);
      }
    };

    const handleChange = (event, { newValue }) => {
      setSearch(newValue);
    };

    const autosuggestProps = {
      renderInputComponent,
      suggestions: suggestions,
      onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: handleSuggestionsClearRequested,
      onSuggestionSelected: handleSuggestionSelected,
      getSuggestionValue,
      renderSuggestion
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
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes: classNames(classes.input, classes),
            id: 'search-card-name',
            label: 'Card Name',
            placeholder: 'Search for a card by name',
            value: search,
            onChange: handleChange,
            variant: 'outlined',
            clear: handleInputClearRequested
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

const StatefulSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);

export default withStyles(styles)(StatefulSearch);
