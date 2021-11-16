import { reactAboutRender } from '../views/utils';

export const renderAbout = (view, title) => {
    return (req, res) => {
        reactAboutRender(res, view(), { title });
    }
}