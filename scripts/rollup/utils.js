import path from 'path';
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

function getPackageJSON(pkgName) {
	const pkgPath = path.resolve(resolvePkgPath(pkgName), 'package.json');
	const str = fs.readFileSync(pkgPath, { encoding: 'utf8' });
	return JSON.parse(str);
}

function getBaseRollupPlugins({ typescript = {} } = {}) {
	// 解析ts代码 + 兼容commonjs规范
	return [cjs(), ts(typescript)];
}

export { resolvePkgPath, getPackageJSON, getBaseRollupPlugins };
