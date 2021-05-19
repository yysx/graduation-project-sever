import Controller from './baseController';
import fs = require('fs');
import path = require('path');
import sd = require('silly-datetime');
import mkdirp = require('mkdirp');


export default class HomeController extends Controller {
  async uploadImg() {
    const { ctx } = this;
    let file = ctx.request.files[0];
    let uploadDir = '';
    try {
      let f = fs.readFileSync(file.filepath);
      let day = sd.format(new Date(), 'YYYYMMDD');
      let dir = path.join(this.config.uploadDir, day);
      await mkdirp(dir);
      let date = Date.now();
      uploadDir = path.join(dir, date + path.extname(file.filename));
      fs.writeFileSync('./' + uploadDir, f)
    } finally {
      ctx.cleanupRequestFiles();
    }
    const url = uploadDir.slice(10).replace(/\\/g, '/');
    this.success({ url });
  }
}