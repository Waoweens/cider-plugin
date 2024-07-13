import { createId } from "@paralleldrive/cuid2"

export default {
    ce_prefix: createId(),
    identifier: 'id.my.wao.cider-plugin',
    name: 'Waoweens\' Cider Plugin',
    description: 'some personal changes to Cider',
    version: '0.0.1',
    author: 'Waoweens',
    repo: 'https://github.com/Waoweens/cider-plugin',
    entry: {
        'plugin.js': {
            type: 'main',
        }
    }
}