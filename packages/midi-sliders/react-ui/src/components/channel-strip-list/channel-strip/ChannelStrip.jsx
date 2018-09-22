import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './MidiSlider'
import MidiButton from './MidiButtons'
import StripLabel from './StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'

class ChannelStrip extends React.Component {
  render () {
    const { sliderEntry, idx, classes, size } = this.props
    const tmpH = (size && size.height) || 0
    const tmpW = (size && size.width) || 0
    const isButton = (sliderEntry.type !== STRIP_TYPE.SLIDER) &&
    (sliderEntry.type !== STRIP_TYPE.LABEL)
    return (
      <div
        className={classes.root}
      >
        {
          (sliderEntry.type === STRIP_TYPE.SLIDER) &&
          <MidiSlider
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
        {
          (isButton) &&
          <MidiButton
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
        {
          (sliderEntry.type === STRIP_TYPE.LABEL) &&
          <StripLabel
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
      </div>
    )
  }
}

const styles = theme => ({
  root: {
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },

  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center'
  }

})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default withStyles(styles)(((connect(null, mapDispatchToProps)(ChannelStrip))))
