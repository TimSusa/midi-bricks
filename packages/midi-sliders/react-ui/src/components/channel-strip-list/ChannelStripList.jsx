import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from './channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ViewSettingsActions from '../../actions/view-settings'
import { withStyles } from '@material-ui/core/styles'

class ChannelStripList extends React.Component {
  state = {
    sliderList: []
  }

  constructor (props) {
    super(props)
    this.state = {
      sliderList: props.sliderList
    }
  }

  componentWillReceiveProps ({ sliderList }) {
    if (sliderList !== this.props.sliderList) {
      this.setState({
        sliderList
      })
    }
  }

  render () {
    const { classes, sliderList, viewSettings } = this.props
    if (sliderList.length > 0) {
      if (viewSettings.isLayoutMode) {
        return (
          <DragDropContext
            onDragEnd={this.onDragEnd}
            id='channelList-layoutMode'
            className={classes.channelList}
          >
            <Droppable droppableId='droppable' direction='horizontal'>
              {({ innerRef, droppableProps }, snapshot) => (
                <div
                  ref={innerRef}
                  style={this.getListStyle(snapshot.isDraggingOver)}
                  {...droppableProps}
                >
                  {this.renderChannelStrips()}
                </div>
              )}
            </Droppable>
          </DragDropContext>

        )
      } else {
        return (
          <div>
            <div id='channelList' className={classes.channelList}>
              {this.renderChannelStrips()}
            </div>
          </div>
        )
      }
    } else {
      return (
        <Typography variant='display1' className={classes.noMidiTypography}>
          <br />
          <br />
          Please add a slider!
          <br />
          <br />
          You can do this with the button at the right top in the AppBar → ↑
        </Typography>
      )
    }
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {

    }

    const sliderList = this.reorder(
      this.state.sliderList,
      result.source.index,
      result.destination.index
    )
    this.setState({
      sliderList
    })
    this.props.actions.updateListOrder(sliderList)
  }

  renderChannelStrips = () => {
    const entries = this.state.sliderList
    return entries && entries.map((sliderEntry, idx) => {
      const data = { sliderEntry, idx }

      if (this.props.viewSettings.isLayoutMode) {
        return (
          <Draggable
            key={`slider-${idx}`}
            draggableId={`slider-${idx}`}
            index={idx}>
            {({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
              <div
                ref={innerRef}
                {...draggableProps}
                {...dragHandleProps}
                style={this.getItemStyle(
                  snapshot.isDragging,
                  draggableProps.style
                )}
              >
                <div
                  style={{ pointerEvents: 'none', backgroundColor: 'rgba(0,255,0,0.3)' }}
                >
                  <ChannelStrip
                    {...data}
                  />
                </div>
              </div>
            )}
          </Draggable>
        )
      } else {
        return (
          <ChannelStrip
            key={`slider-${idx}`}
            {...data}
          />
        )
      }
    })
  }

  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: 8,
    overflow: 'auto'
  })

  // a little function to help us with reordering the result
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 ${8}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  })
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    overflowX: 'scroll'
  }
})

function mapStateToProps ({ sliderList, viewSettings }) {
  return {
    sliderList,
    viewSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(ViewSettingsActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChannelStripList)))
