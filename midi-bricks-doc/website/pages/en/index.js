/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')

const MarkdownBlock = CompLibrary.MarkdownBlock /* Used to read markdown */
const Container = CompLibrary.Container
const GridBlock = CompLibrary.GridBlock

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props
    const { baseUrl, docsUrl } = siteConfig
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
    const langPart = `${language ? `${language}/` : ''}`
    const docUrl = (doc) => `${baseUrl}${docsPart}${langPart}${doc}`

    const SplashContainer = (props) => (
      <div className='homeContainer'>
        <div className='homeSplashFade'>
          <div className='wrapper homeWrapper'>{props.children}</div>
        </div>
      </div>
    )

    const Logo = (props) => (
      <div className='projectLogo'>
        {/* <img src={`${baseUrl}img/midi-briqks-live-view.png`} alt="Project Logo" /> */}
      </div>
    )

    const ProjectTitle = () => (
      <h2 className='projectTitle'>
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    )

    const PromoSection = (props) => (
      <div className='section promoSection'>
        <div className='promoRow'>
          <div className='pluginRowBlock'>{props.children}</div>
        </div>
      </div>
    )

    const Button = (props) => (
      <div className='pluginWrapper buttonWrapper'>
        <a className='button' href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    )

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/docusaurus.svg`} />
        <div className='inner'>
          <ProjectTitle siteConfig={siteConfig} />
          {/* <PromoSection>
            <Button href="#try">do some stuff by clicking here</Button>
            <Button href={docUrl('introduction.html')}>Link to doc 1</Button>
            <Button href={docUrl('downloadAndInstall.html')}>Link to doc 2</Button>
          </PromoSection> */}
          <br></br>
          <br></br>
          <a href='#learn-how'>
            <img
              width='80%'
              style={{ borderRadius: 3 }}
              src={`${baseUrl}img/midi-briqks-live-view.png`}
            ></img>
          </a>
        </div>
      </SplashContainer>
    )
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props
    const { baseUrl } = siteConfig

    const Block = (props) => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align='center'
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    )

    const FeatureCallout = () => (
      <div
        className='productShowcaseSection paddingBottom'
        style={{ textAlign: 'center' }}
      >
        <h2>
          {' '}
          <a href='https://github.com/TimSusa/midi-bricks/releases'>
            It is Freeware! <br></br>
            <br></br> Be informed with automatic updates.
          </a>
        </h2>
        <MarkdownBlock>
          MIDI Bricks is for free, because it is open source software. You can
          even have automatic updates available.
        </MarkdownBlock>
        <a href='https://github.com/TimSusa/midi-bricks/releases'>
          Download actual release from github.
        </a>
      </div>
    )

    const TryOut = () => (
      <Block id='try'>
        {[
          {
            content:
              'Add Buttons or sliders, where you can pick colors. Position them where you want',
            image: `${baseUrl}img/button-config.gif`,
            imageAlign: 'left',
            imageLink: `${baseUrl}docs/introduction`,
            title: 'Rapidly configure your elements.'
          }
        ]}
      </Block>
    )

    const Description = () => (
      <Block background='dark'>
        {[
          {
            content: 'Build up a slider bay with shortcuts in 5sec',
            image: `${baseUrl}img/MIDI-bricks-shortcut-d.gif`,
            imageAlign: 'right',
            imageLink: `${baseUrl}docs/introduction`,
            title: 'Be incredibly productive'
          }
        ]}
      </Block>
    )

    const LearnHow = () => (
      <Block background='light' id='learn-how'>
        {[
          {
            content:
              'Learn how to create your custom Touch MIDI Controller Layout.',
            image: `${baseUrl}img/midi-briqks-normal-view.png`,
            imageLink: `${baseUrl}docs/introduction`,
            imageAlign: 'right',
            title: 'Your first touch controller layout.'
          }
        ]}
      </Block>
    )

    const Features = () => (
      <Block layout='fourColumn'>
        {[
          {
            content:
              'Add touch sliders, buttons, labels and position them as you like via drag and drop. You can save your configuration into a file and easily load it. The app is usable even in any offline scenario without any internet connectivity.',
            // image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'top',
            title: 'Free customizable Touch Controller Layouts'
          },
          {
            content:
              'Connecting to your MIDI Devices made easy. Just change the controller and the application will learn what is needed. You can even have different MIDI Drivers for input and output or even different drivers for each Button or Slider.',
            //  image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'top',
            title: 'MIDI Learn'
          }
        ]}
      </Block>
    )

    const UsedOpenSourceSoftware = () => (
      <Block layout='fourColumn'>
        {[
          {
            content:
              'We like ReactJS, although it is from facebook. WTF who cares? It does an amazing job!',
            image: `${baseUrl}img/react-logo.svg`,
            imageLink: 'https://reactjs.org/',
            imageAlign: 'top',
            title: 'ReactJS'
          },
          {
            content:
              'Material UI is an open source library exposing a lot of useful GUI Components. Furthermore, theming is possible. We use it for our dark or light theme.',
            image: `${baseUrl}img/material-ui-logo.svg`,
            imageLink: 'https://material-ui.com/',
            imageAlign: 'top',
            title: 'Material UI'
          },
          {
            content:
              'With Electron we made it possible to offer crossplatform installers for MacOSX, Win and Linux',
            image: `${baseUrl}img/electronlogo.png`,
            imageLink: 'https://electronjs.org/',
            imageAlign: 'top',
            title: 'Electron'
          },
          {
            content:
              'WebMIDI is a library on top of the native Web-MIDI Interface. It provides comfortable use of the API wihtout getting your head on fire.',
            image: `${baseUrl}img/webmidi-image.svg`,
            imageLink: 'https://github.com/djipco/webmidi',
            imageAlign: 'top',
            title: 'WebMIDI'
          }
        ]}
      </Block>
    )

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null
      }

      const showcase = siteConfig.users
        .filter((user) => user.pinned)
        .map((user) => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ))

      const pageUrl = (page) =>
        baseUrl + (language ? `${language}/` : '') + page

      return (
        <div className='productShowcaseSection paddingBottom'>
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className='logos'>{showcase}</div>
          <div className='more-users'>
            <a className='button' href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      )
    }

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className='mainContainer'>
          <Features />
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />
          <UsedOpenSourceSoftware />
          <Showcase />
        </div>
      </div>
    )
  }
}

module.exports = Index
