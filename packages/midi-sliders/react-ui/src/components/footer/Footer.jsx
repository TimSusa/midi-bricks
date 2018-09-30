import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

class Footer extends React.Component {
  state = {
    value: 0
  }

  render () {
    const { classes, sliderList } = this.props
    const { value } = this.state
    if (sliderList.every((item) => (item.type !== 'PAGE'))) return (<div />)
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        {this.extractLabels(sliderList).map((item, idx) => {
          return (
            <Button
              className={classes.button}
              key={`footer-button-${idx}`}
              onClick={this.handleClick.bind(this, item)}
            >
              {item.label}
            </Button>
          )
        })}
      </BottomNavigation>
    )
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  extractLabels = (list) => {
    let tmp = []
    list.forEach((item) => {
      if (item.type === 'PAGE') {
        tmp.push(item)
      }
    })
    return tmp
  }

  handleClick = (entry, e) => {
    const elem = document.getElementById(`page-${entry.i}`)
    elem.scrollIntoView()
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}
const styles = (theme) => ({
  root: {
    background: theme.palette.appBar.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  button: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600
  }
})

function mapStateToProps ({ sliderList }) {
  return {
    sliderList
  }
}
export default (withStyles(styles)(connect(mapStateToProps, null)(Footer)))
