<template>
  <a-layout>
    <a-layout-sider
      width="250"
      :style="{ background: '#FAFAFA', overflowY: 'scroll' }"
    >
      <a-menu :style="{ background: '#FAFAFA' }">
        <a-menu-item-group key="g1">
          <template slot="title">
            <a-icon type="user-add" /><span>好友请求</span>
          </template>
          <a-list item-layout="horizontal" :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta description="搞笑">
                <a slot="title" href="https://www.antdv.com/">{{
                  item.title
                }}</a>
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-menu-item-group>
        <a-menu-item-group key="g2">
          <template slot="title">
            <a-icon type="usergroup-add" /><span>群聊请求</span>
          </template>
          <a-list item-layout="horizontal" :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta description="搞笑">
                <a slot="title" href="https://www.antdv.com/">{{
                  item.title
                }}</a>
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-menu-item-group>
        <a-menu-item-group key="g3">
          <template slot="title">
            <a-icon type="to-top" /><span>群聊邀请</span>
          </template>
          <a-list item-layout="horizontal" :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta description="搞笑">
                <a slot="title" href="https://www.antdv.com/">{{
                  item.title
                }}</a>
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-menu-item-group>
      </a-menu>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '24px 24px', minHeight: '280px' }">
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          title: "Ant Design Title 1",
        },
        {
          title: "Ant Design Title 2",
        },
        {
          title: "Ant Design Title 3",
        },
        {
          title: "Ant Design Title 4",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.ant-list {
  width: 90%;
  margin: 0 auto;
}
</style>
