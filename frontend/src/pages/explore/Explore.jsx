import React from 'react'
import { Button, Icon, Container, Header, List, Grid, Form, Divider, Dropdown, Segment, Radio, Input} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

//Fretty for inspiration
//Ian Ring for inspiration

//colors: 
// C = Red
// C# = Red-Orange
// D = Orange
// D# = Yellow Orange
// E = Yellow
// F = Yellow-Green
// F# = Green
// G = Blue-Green
// G# = Blue
// A = Blue-Violet
// A# = Violet
// B = Red-Violet

export default function Explore() {
    return (
        <>
     <div className='controls'>
       <div className="control_header">
       <Segment textAlign='right'>
       <Header as='h1' textAlign='left'>Noodler</Header>
       <Header textAlign='right'> Global Style</Header>
       <Header textAlign='right'> Theme</Header>
         <div> BPM: 120</div>
        <input type="range"
        min='11'
        max='808' />
       </Segment>
       </div>
            <Button 
            inverted
            color='blue'
            >
                <Icon name = "pause" />
                pause
            </Button>
            <Button 
            inverted
            color='green'
            >
                <Icon name = "play" />
                play
            </Button>
            <Button 
            inverted
            color='red'
            >
                <Icon name = "stop" />
                stop
            </Button> 
            <Button 
            inverted
            color='orange'
            >
                <Icon name = "fast backward" />
                prev
            </Button> 
            <Button 
            inverted
            color='orange'
            >
                <Icon name = "fast forward" />
                next
            </Button> 
    </div>
    <Divider></Divider>
    <div className='components'>
        <Container>
     <Grid divided='vertically'>
         <Grid.Row columns={3}>
            <Grid.Column>
            <Header> Patterns
            <Icon name="search"></Icon>
        </Header>
            <List divided relaxed>
    <List.Item>
      <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Up Two, Down Two</List.Header>
        <List.Description as='a'>2, -2</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
    <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Arpeggio Up</List.Header>
        <List.Description as='a'>2,2,3</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
    <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Scale up</List.Header>
        <List.Description as='a'>1</List.Description>
      </List.Content>
    </List.Item>
  </List>
            </Grid.Column>
            <Grid.Column>
            <Header> Chord Progressions
            <Icon name="search"></Icon>
        </Header>
            <List divided relaxed>
    <List.Item>
      <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Pop Standard</List.Header>
        <List.Description as='a'>I V vi IV</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
    <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>La Bamba</List.Header>
        <List.Description as='a'>I IV V IV</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
    <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Jazz Cadence (Major)</List.Header>
        <List.Description as='a'>ii-7 V7 IMaj7</List.Description>
      </List.Content>
    </List.Item>
  </List>
            </Grid.Column>
            <Grid.Column>
            <Header> Scales
            <Icon name="search"></Icon>
        </Header>
            <List divided relaxed>
    <List.Item>
      <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Major Scale</List.Header>
        <List.Description as='a'>101010110101</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
    <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Minor Scale</List.Header>
        <List.Description as='a'>101101011010</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
    <List.Icon name='check square outline' size='large' verticalAlign='middle' />
      <List.Icon name='star' size='large' verticalAlign='middle' />
      <List.Icon name='flag outline' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>Melodic Minor</List.Header>
        <List.Description as='a'>101100110101</List.Description>
      </List.Content>
    </List.Item>
  </List>
            </Grid.Column>
         </Grid.Row>
     </Grid>
    </Container>
 
    </div>
    <div className='chord_progression'>
    <Header>Chord Progression</Header>
    <Header>Options ? Random : Endless</Header>
      <Button negative>Edit</Button>
      <Button positive>Play</Button>
      <Divider></Divider>
      <Grid columns = {8} divided ='vertically'>
        <Grid.Row>
          <Grid.Column>
          <Header as='h3' textAlign='center'> I </Header>
          <Button inverted fluid color='red' > C Major</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          <Dropdown 
          fluid
          selection
          placeholder='Fingering'/>
          <Dropdown 
          fluid
          selection
          placeholder='Key'/>
          <Dropdown 
          fluid
          selection
          placeholder='Scale'/>
          <Dropdown 
          fluid
          selection
          placeholder='Pattern'/>
          <Dropdown 
          fluid
          selection
          placeholder='Beats'/>
          <Dropdown 
          fluid
          selection
          placeholder='Rhythm'/>
          <Header as='p' textAlign='center'>Beats: 4</Header>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> ii </Header>
          <Button inverted fluid color='blue' > D minor</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> I </Header>
          <Button inverted fluid color='red' > C Major</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          <Dropdown 
          fluid
          selection
          placeholder='Fingering'/>
          <Dropdown 
          fluid
          selection
          placeholder='Key'/>
          <Dropdown 
          fluid
          selection
          placeholder='Beats'/>
          <Dropdown 
          fluid
          selection
          placeholder='Rhythm'/>
          <Header as='p' textAlign='center'>Beats: 4</Header>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> ii </Header>
          <Button inverted fluid color='blue' > D minor</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> I </Header>
          <Button inverted fluid color='red' > C Major</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          <Dropdown 
          fluid
          selection
          placeholder='Fingering'/>
          <Dropdown 
          fluid
          selection
          placeholder='Key'/>
          <Dropdown 
          fluid
          selection
          placeholder='Beats'/>
          <Dropdown 
          fluid
          selection
          placeholder='Rhythm'/>
          <Header as='p' textAlign='center'>Beats: 4</Header>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> ii </Header>
          <Button inverted fluid color='blue' > D minor</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> I </Header>
          <Button inverted fluid color='red' > C Major</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          <Dropdown 
          fluid
          selection
          placeholder='Fingering'/>
          <Dropdown 
          fluid
          selection
          placeholder='Key'/>
          <Dropdown 
          fluid
          selection
          placeholder='Beats'/>
          <Dropdown 
          fluid
          selection
          placeholder='Rhythm'/>
          <Header as='p' textAlign='center'>Beats: 4</Header>
          </Grid.Column>
          <Grid.Column>
          <Header as='h3' textAlign='center'> ii </Header>
          <Button inverted fluid color='blue' > D minor</Button>
          <Form>
            <Form.Field>
              <input placeholder='Input Chord'/>
            </Form.Field>
          </Form>
          </Grid.Column>
          <Grid.Column>
          <Icon link name='plus circle' onClick={() => console.log('you clicked me')}></Icon>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    <Divider></Divider>
    <div className='scales'>
    <Header>Scales Mode</Header>
    <Header>Options</Header>
    <List>
      <List.Item>Playthrough ? Discrete : Continuous </List.Item>
      <List.Item>Reset to Default </List.Item>
      <List.Item>On Major Chords: Default</List.Item>
      <List.Item>On Minor Chords: Default</List.Item>
      <List.Item>On Modal Substitutions: Default</List.Item>
      <List.Item>Non-Functional Dominant: Lydian Dominant</List.Item>
      <List.Item>Borrowed Minor: Dorian</List.Item>
      <List.Item>III Dominant/Major: Phrygian Dominant</List.Item>
      <List.Item>Borrowed Major: Lydian</List.Item>
      <List.Item>Diminished: Diminished Scale</List.Item>
      <List.Item>Half-Diminished: Half-Diminished Scale</List.Item>
      <List.Item>Altered: Altered ? Lydian Dominant ? Diminished ? Whole Tone</List.Item>

    </List>
    <Header>Scales</Header>
    <List>
      <List.Item>Major Scale</List.Item>
      <List.Item>Minor Scale</List.Item>
      <List.Item>Dim Scale</List.Item>
      <List.Item>Augmented Scale</List.Item>
      <List.Item>Whote Tone</List.Item>
    </List>

    </div>
    <Divider></Divider>
    <div className='scale_explorer'>
      <Header>Scale Explorer<Icon name='question'></Icon></Header>
      <Header>Search</Header>
      <Input placeholder='Search for scales...'/>
      <Header>Input</Header>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Radio/>
      <Header>Scale Name</Header>
    </div>
    <Divider></Divider>
    <div className='lesson plan'>
      <Header>Today's Lesson Plan
      </Header>
      <Icon name = 'calendar outline' />
      <List>
        <List.Item>Pentatonic Warmup</List.Item>
        <List.Item>Mode warmup in all 12 keys</List.Item>
        <List.Item>Bending Technique</List.Item>
        <List.Item>Guitar etude #1</List.Item>
        <List.Item>Guitar etude #2 </List.Item>
        <List.Item>Guitar etude #3</List.Item>
        <List.Item>Cool Down</List.Item>
      </List>
    </div>
    </>
    )
}
