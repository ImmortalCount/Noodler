import React from 'react'
import { Button, Grid, Segment} from 'semantic-ui-react'

export default function ButtonFinder() {
    return (
        <div>
            <h3>Finder</h3>
        <Grid padded  columns={6}>
            <Grid.Row>
            <Grid.Column color='blue' textAlign='center'>
                Global
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Local
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column color='blue' textAlign='center'>
                Components
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Collections
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Songs/Exerc...
            </Grid.Column >
            </Grid.Row>
            <Grid.Row>
            <Grid.Column color='blue' textAlign='center'>
                Modules
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
               Chords
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Scales
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Rhythms
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Patterns
            </Grid.Column>
            <Grid.Column color='blue' textAlign='center'>
                Rhy-Pat
            </Grid.Column>
            </Grid.Row>
        </Grid>
        </div>
    )
}
