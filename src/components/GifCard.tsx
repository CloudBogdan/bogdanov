interface IGifCard {
    src: string
}

const GifCard: Solid.Component<IGifCard> = props=> {
    return (
        <div class="gif-card">
            <img class="gif" src={ props.src } />
        </div>
    );
};

export default GifCard;