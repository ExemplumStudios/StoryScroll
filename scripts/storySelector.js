function storyLoad(url) {
    d3.json(url, function (data) {
        d3.select('#intro').remove();
        
        var currentStory = data;

        function redraw() {
            var heightResponsive = window.innerHeight * 0.8;
            var widthResponsive = window.innerWidth * 0.5;

            d3.selectAll('svg').remove();
            d3.selectAll('#tooltipNode').remove();

            storyScroll(widthResponsive, heightResponsive, 100, currentStory);
        }

        redraw();

        window.addEventListener('resize', redraw);
    });
};

d3.select('#test').on('click', function () {
    storyLoad('/data/test.json');
    d3.selectAll('.storySelector').classed('active', false);
    d3.select('#test').classed('active', true);
});

d3.select('#impossibleCourage').on('click', function () {
    storyLoad('/data/impossibleCourage.json');
    d3.selectAll('.storySelector').classed('active', false);
    d3.select('#impossibleCourage').classed('active', true);
});
