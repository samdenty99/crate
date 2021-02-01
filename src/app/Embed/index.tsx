import * as React from 'react'
import { connect } from 'react-redux'

import { APIContext } from '..'
import { State } from '../../types/store'
import { IFrame, Root } from './elements'

interface StateProps {
  options: {
    server: string
    channel: string
    shard: string
  }
  interactive: boolean
  open: boolean
}

class Embed extends React.PureComponent<StateProps> {
  state = {
    deferred: true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.interactive && !this.props.interactive) {
      // User toggled open embed
      this.setState({ deferred: false })
    }
  }

  componentDidMount() {
    const { interactive } = this.props

    // Allow 5 seconds for the target page to load,
    // before attempting to load the embed
    if (interactive) {
      setTimeout(() => this.setState({ deferred: false }), 5000)
    }
  }

  render() {
    const { options, open } = this.props
    const { deferred } = this.state

    if (!options.shard.startsWith('http')) options.shard = `https://${options.shard}`
    if (options.shard.endsWith('/')) options.shard = options.shard.substring(0, options.shard.length - 1)

    return (
      <Root className="embed">
        <APIContext.Consumer>
          {onAPI => (
            <IFrame
              {...options}
              options={{
                preset: 'crate'
              }}
              defer={deferred}
              onAPI={onAPI}
              className="react-embed"
              focusable={open}
            />
          )}
        </APIContext.Consumer>
      </Root>
    )
  }
}

export default connect<StateProps, {}, {}, State>(
  ({ interactive, options, open }) => ({
    options: {
      server: options.server,
      channel: options.channel,
      shard: options.shard
    },
    interactive,
    open
  })
)(Embed)
