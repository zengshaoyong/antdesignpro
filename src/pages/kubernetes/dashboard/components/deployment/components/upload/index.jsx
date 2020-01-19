import {Upload, Icon, message} from 'antd';
import React from "react";

const {Dragger} = Upload;

// const Upload_yaml = () => {
class Upload_yaml extends React.Component {

  // done = () => {
  //   this.props.upload_done()
  // }

  onChange = (info) => {
    const {status} = info.file;
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      // console.log('done', info)
      this.props.upload_done(info.file.response.data)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  render() {
    // console.log(this.props)

    return (
      <Dragger
        name='file'
        multiple={false}
        action='http://127.0.0.1:5000/upload'
        onChange={this.onChange}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox"/>
        </p>
        <p className="ant-upload-text">点击或直接拖动文件到此窗口</p>
        <p className="ant-upload-hint">
          请直接上传完整的Yaml文件
        </p>
      </Dragger>
    );
  }
}

export default Upload_yaml;
