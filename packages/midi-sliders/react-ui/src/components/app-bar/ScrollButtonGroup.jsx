import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

class ScrollButtonGroup extends React.Component {
  render () {
    const { sliderListLength } = this.props
    if ((sliderListLength * 140 - document.documentElement.clientWidth) > 0) {
      return (
        <React.Fragment>
          <Button
            color='inherit'
            raised='true'
            onClick={() => { document.getElementById('channelList').scrollLeft -= (document.documentElement.clientWidth / 40 * 40) }}>
          LEFT
          </Button>
          <Button
            color='inherit'
            raised='true'
            onClick={() => { document.getElementById('channelList').scrollLeft += (document.documentElement.clientWidth / 40 * 40) }}>
          RIGHT
          </Button>
        </React.Fragment>
      )
    } else {
      return (
        <div />
      )
    }
  }
}

ScrollButtonGroup.propTypes = {
  sliderListLength: PropTypes.number.isRequired
}

export default ScrollButtonGroup
