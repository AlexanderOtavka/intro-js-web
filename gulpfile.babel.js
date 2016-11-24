/**
 * gulpfile.js
 *
 * Created by Zander Otavka on 11/23/16.
 * Copyright (C) 2016 Zander Otavka.  All rights reserved.
 *
 * Distributed under the GNU General Public License, Version 3.
 * See the accompanying file LICENSE or http://www.gnu.org/licenses/gpl-3.0.txt
 */

import gulp from "gulp";
import gulpIf from "gulp-if";
import fastpipe from "fastpipe";
import path from "path";
import size from "gulp-size";
import run from "run-sequence";
import sourcemaps from "gulp-sourcemaps";

import del from "del";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import unassert from "gulp-unassert";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import htmlmin from "htmlmin";


// Transforms

// todo: fix htmlmin task
const minifyHTML = () => fastpipe();
    // gulpIf("*.html", htmlmin({
    //     collapseInlineTagWhitespace: true,
    //     collapseWhitespace: true
    // }));

const processCSS = () =>
    gulpIf("*.css", postcss([
        autoprefixer({ browsers: ["> 5%"] }),
        cssnano()
    ]));

const processJS = () =>
    gulpIf("*.js", fastpipe()
        // todo: fix issue with webcomponents and transpiled js
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(unassert())
        .pipe(uglify()));


// Tasks

const createTask = (dir, transform, files = ["**/*"]) => () =>
    gulp.src(files.map(f => path.join(dir, f)))
        .pipe(sourcemaps.init())
            .pipe(transform())
        .pipe(sourcemaps.write())
        .pipe(size({ title: dir }))
        .pipe(gulp.dest(path.join("build", dir)));

gulp.task("clean", () => del(["build/**"]));
gulp.task("root", createTask(".", minifyHTML, ["{about,index}.html", "people.json"]));
gulp.task("src", createTask("src", processJS));
gulp.task("drawables", createTask("res/drawables", fastpipe));
gulp.task("images", createTask("res/images", fastpipe));
gulp.task("styles", createTask("res/styles", processCSS));
gulp.task("views", createTask("res/views", minifyHTML));

gulp.task("default", done =>
    void run(
        "clean",
        ["root", "src", "drawables", "images", "styles", "views"],
        done
    )
);
