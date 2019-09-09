import BackgroundImage from '../../images/bgBase.jpg';

export const DEFAULT_STYLES = {
    '@global': {
        body: {
            backgroundColor: 'white',
        },
    },
    container: {
       flexGrow: 1,
       margin: '0 auto',
       backgroundImage: `url(${BackgroundImage})`,
       backgroundRepeat: 'no-repeat',
       backgroundSize: 'cover',
       height: '100vh'
    },
    avatar: {
        margin: 5,
        backgroundColor: 'white',
        color: 'gray'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: 5,
    },
    submit: {
        margin: 2,
        marginBottom: 7
    },
    formContainer: {
        padding: 30,
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'white',
        opacity: 0.9,
        borderRadius: 12
    },
    input: {
        margin: 5
    }
};
