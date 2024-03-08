export class Enums {
    public statusColor = {
        proposed: '$\\color{DodgerBlue}{proposed}$',
        acceptance: '$\\color{MediumSeaGreen}{acceptance}$',
        rejection: '$\\color{Tomato}{rejection}$',
        deprecation: '$\\color{Orange}{deprecation}$',
        superseding: '$\\color{Violet}{superseding}$',
    };

    public markdownEngine = {
        github: 'github',
        gitlab: 'gitlab',
    };

    public statusColorGitlab = {
        proposed: '$\\textcolor{DodgerBlue}{\\text{proposed}}$',
        acceptance: '$\\textcolor{MediumSeaGreen}{\\text{acceptance}}$',
        rejection: '$\\textcolor{Tomato}{\\text{rejection}}$',
        deprecation: '$\\textcolor{Orange}{\\text{deprecation}}$',
        superseding: '$\\textcolor{Violet}{\\text{superseding}}$',
    }
}
export default Enums;
