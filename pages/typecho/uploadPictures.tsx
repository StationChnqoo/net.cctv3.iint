import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Upload } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { GetStaticProps } from "next";
import { useRouter, withRouter } from "next/router";
import React, { useState } from "react";
import { Picture } from "../../interfaces";
import styles from "../../styles/Article.module.css";
import { Host4NodeJS, Host4Springboot, useUUID } from "../../x";
import Frameweork from "../framework";

interface UploadPicturesProps {}

const WriteArticle: React.FC<UploadPicturesProps> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState<Picture[]>([]);

  return (
    <Frameweork>
      <Form className={styles.views} layout={"vertical"}>
        <Form.Item label="文章头图">
          <Upload
            action={`${Host4Springboot}/fileUploader.action`}
            listType="picture"
            maxCount={10}
            multiple={true}
            data={{ target: "net.cctv3.next/picture" }}
            onChange={(e) => {
              setPictures(
                Array.from(e.fileList)
                  .filter((it) => it.status == "done")
                  .map((it) => ({
                    id: useUUID(),
                    file: it.name,
                    title: it.name,
                    message: "",
                    status: true,
                    createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    updateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                  }))
              );
            }}
          >
            <Button icon={<UploadOutlined />}>请上传图骗</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="上传所有图骗">
          <Button
            type="primary"
            style={{ width: "100%" }}
            loading={loading}
            onClick={() => {
              setLoading(true);
              fetch(`${Host4NodeJS}/album/insertPictures`, {
                method: "POST",
                body: JSON.stringify({ id: router.query.id, data: pictures }),
              }).then((response) => {
                router.back();
              });
            }}
          >
            确认上传
          </Button>
        </Form.Item>
      </Form>
    </Frameweork>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default withRouter(WriteArticle);