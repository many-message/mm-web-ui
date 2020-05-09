<template>
  <a-layout>
    <a-layout-sider
      width="300"
      :style="{ background: '#FAFAFA', overflowY: 'scroll' }"
    >
      <a-tabs default-active-key="1">
        <a-tab-pane key="1">
          <span slot="tab" class="cantact-font">
            <a-icon type="user" />
            好友
          </span>
          <a-collapse :bordered="false" class="cantact-font">
            <template #expandIcon="props">
              <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <a-collapse-panel
              v-for="(friendGroup, index) in friendGroups"
              :key="friendGroup.friendGroupId"
              :header="
                friendGroup.friendGroupName +
                  '(' +
                  friendGroup.friends.length +
                  ')'
              "
              :style="customStyle"
            >
              <a-list item-layout="horizontal">
                <a-list-item
                  v-for="friend in friendGroup.friends"
                  :key="friend.friendId"
                >
                  <a-list-item-meta :description="friend.email">
                    <router-link
                      slot="title"
                      :to="'/home/cantact/friend/' + friend.friendId"
                    >
                      {{ friend.friendName }}
                    </router-link>
                    <a-avatar slot="avatar" class="photo">{{
                      sliceNickname(friend.nickname)
                    }}</a-avatar>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
              <a-icon
                slot="extra"
                v-if="friendGroup.friendGroupName !== '我的好友'"
                v-on:click.stop="showUpdateFriendGroupModal(index)"
                class="group-icon"
                type="edit"
              />
              <a-icon
                slot="extra"
                v-if="friendGroup.friendGroupName !== '我的好友'"
                v-on:click.stop="
                  handleDeleteFriendGroup(friendGroup.friendGroupId)
                "
                class="group-icon"
                type="delete"
              />
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab" class="cantact-font">
            <a-icon type="team" />
            群聊
          </span>
          <a-collapse :bordered="false" class="cantact-font">
            <template #expandIcon="props">
              <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <a-collapse-panel
              key="1"
              :header="'我的群聊(' + myGroups.length + ')'"
              :style="customStyle"
            >
              <a-list item-layout="horizontal">
                <a-list-item v-for="group in myGroups" :key="group.groupId">
                  <a-list-item-meta :description="group.groupNum">
                    <router-link
                      slot="title"
                      :to="'/home/cantact/group/' + group.groupId"
                    >
                      {{ group.groupName }}
                    </router-link>
                    <a-avatar slot="avatar" class="photo">{{
                      sliceNickname(group.groupName)
                    }}</a-avatar>
                  </a-list-item-meta>
                  <div>{{ group.groupMemberNum }}人</div>
                </a-list-item>
              </a-list>
            </a-collapse-panel>
            <a-collapse-panel
              key="2"
              :header="'我加入的群聊(' + joinGroups.length + ')'"
              :style="customStyle"
            >
              <a-list item-layout="horizontal">
                <a-list-item v-for="group in joinGroups" :key="group.groupId">
                  <a-list-item-meta :description="group.groupNum">
                    <router-link
                      slot="title"
                      :to="'/home/cantact/group/' + group.groupId"
                    >
                      {{ group.groupName }}
                    </router-link>
                    <a-avatar slot="avatar" class="photo">{{
                      sliceNickname(group.groupName)
                    }}</a-avatar>
                  </a-list-item-meta>
                  <div>{{ group.groupMemberNum }}人</div>
                </a-list-item>
              </a-list>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
      <a-dropdown :trigger="['click']" placement="topRight">
        <a-icon type="plus" class="add-icon" @click="e => e.preventDefault()" />
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="showAddFriendGroupModal">
            添加分组
          </a-menu-item>
          <a-menu-item key="2" @click="showAddGroup">
            创建群聊
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <!-- 添加好友分组 -->
      <a-modal
        title="添加分组"
        :visible="addFriendGroupVisible"
        :confirm-loading="addFriendGroupConfirmLoading"
        @ok="handleAddFriendGroupOk"
        @cancel="handleAddFriendGroupCancel"
      >
        <a-input
          v-model="addFriendGroupName"
          @change="handleAddFriendGroupNameChange"
          placeholder="请输入分组名"
        />
      </a-modal>
      <!-- 修改好友分组 -->
      <a-modal
        title="修改分组"
        :visible="updateFriendGroupVisible"
        :confirm-loading="updateFriendGroupConfirmLoading"
        @ok="handleUpdateFriendGroupOk"
        @cancel="handleUdateFriendGroupCancel"
      >
        <a-input
          v-model="updateFriendGroupInfo.friendGroupName"
          @change="handleUpdateFriendGroupNameChange"
          placeholder="请输入分组名"
        />
      </a-modal>
      <!-- 创建群聊 -->
      <a-modal
        title="创建群聊"
        :visible="addGroupVisible"
        :confirm-loading="addGroupConfirmLoading"
        @ok="handleAddGroupOk"
        @cancel="handleAddGroupCancel"
      >
        <a-input
          v-model="addGroupInfo.groupName"
          @change="handleAddGroupNameChange"
          placeholder="请输入群聊名称"
        />
        <a-input
          v-model="addGroupInfo.groupDesc"
          @change="handleAddGroupDescChange"
          placeholder="请输入群聊描述"
          :style="{ marginTop: '20px' }"
        />
      </a-modal>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '24px 24px', minHeight: '280px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("cantact");

export default {
  data() {
    return {
      customStyle: "{border-radius: 4px; border: 0; overflow: hidden}",
      // 添加好友分组对话框
      addFriendGroupVisible: false,
      addFriendGroupConfirmLoading: false,
      addFriendGroupName: null,
      // 修改好友分组对话框
      updateFriendGroupVisible: false,
      updateFriendGroupConfirmLoading: false,
      updateFriendGroupInfo: {
        friendGroupId: null,
        friendGroupName: null,
      },
      // 添加群聊
      addGroupVisible: false,
      addGroupConfirmLoading: false,
      addGroupInfo: {
        groupName: null,
        groupDesc: null,
      },
    };
  },
  computed: {
    ...mapState(["friendGroups", "myGroups", "joinGroups"]),
  },
  methods: {
    ...mapActions([
      "getFriendGroups",
      "updateFriendGroup",
      "addFriendGroup",
      "deleteFriendGroup",
      "getGroups",
      "addGroup",
    ]),
    sliceNickname(nickname) {
      return sliceNickname(nickname);
    },
    // 添加分组
    showAddFriendGroupModal() {
      this.addFriendGroupVisible = true;
      this.addFriendGroupName = null;
    },
    handleAddFriendGroupNameChange() {
      if (this.addFriendGroupName) {
        this.addFriendGroupName = this.addFriendGroupName.trim();
      }
    },
    handleAddFriendGroupOk() {
      if (!this.addFriendGroupName) {
        this.$message.error("请填写分组名！");
        return;
      }
      this.addFriendGroupConfirmLoading = true;
      // 添加分组
      this.addFriendGroup({
        friendGroupName: this.addFriendGroupName,
        success: () => {
          this.addFriendGroupVisible = false;
          this.addFriendGroupConfirmLoading = false;
        },
        error: () => {
          this.addFriendGroupConfirmLoading = false;
        },
      });
    },
    handleAddFriendGroupCancel() {
      this.addFriendGroupVisible = false;
    },
    // 修改分组
    showUpdateFriendGroupModal(index) {
      const { friendGroupId, friendGroupName } = this.friendGroups[index];
      this.updateFriendGroupInfo = {
        friendGroupId,
        friendGroupName,
      };
      this.updateFriendGroupVisible = true;
    },
    handleUpdateFriendGroupNameChange() {
      if (this.updateFriendGroupInfo.friendGroupName) {
        this.updateFriendGroupInfo.friendGroupName = this.updateFriendGroupInfo.friendGroupName.trim();
      }
    },
    handleUpdateFriendGroupOk() {
      if (!this.updateFriendGroupInfo.friendGroupName) {
        this.$message.error("请输入分组名！");
        return;
      }
      this.updateFriendGroupConfirmLoading = true;
      // 修改分组名
      this.updateFriendGroup({
        friendGroup: this.updateFriendGroupInfo,
        success: () => {
          this.updateFriendGroupVisible = false;
          this.updateFriendGroupConfirmLoading = false;
        },
        error: () => {
          this.addFriendGroupConfirmLoading = false;
        },
      });
    },
    handleUdateFriendGroupCancel() {
      this.updateFriendGroupVisible = false;
    },
    // 删除分组
    handleDeleteFriendGroup(friendGroupId) {
      this.deleteFriendGroup(friendGroupId);
    },
    // 添加群聊
    showAddGroup() {
      this.addGroupVisible = true;
      this.addGroupInfo = {
        groupName: null,
        groupDesc: null,
      };
    },
    handleAddGroupNameChange() {
      if (this.addGroupInfo.groupName) {
        this.addGroupInfo.groupName = this.addGroupInfo.groupName.trim();
      }
    },
    handleAddGroupDescChange() {
      if (this.addGroupInfo.groupDesc) {
        this.addGroupInfo.groupDesc = this.addGroupInfo.groupDesc.trim();
      }
    },
    handleAddGroupOk() {
      if (!this.addGroupInfo.groupName) {
        this.$message.error("请输入群聊名称！");
        return;
      }
      if (!this.addGroupInfo.groupDesc) {
        this.$message.error("请输入群聊描述！");
        return;
      }
      this.addGroupConfirmLoading = true;
      // 修改分组
      this.addGroup({
        group: this.addGroupInfo,
        success: () => {
          this.addGroupVisible = false;
          this.addGroupConfirmLoading = false;
        },
        error: () => {
          this.addGroupConfirmLoading = false;
        },
      });
    },
    handleAddGroupCancel() {
      this.addGroupVisible = false;
    },
  },
  mounted() {
    this.getFriendGroups();
    this.getGroups();
  },
};
</script>

<style lang="less">
.cantact-font {
  font-size: 16px;
}
.photo {
  background-color: #1da57a;
}
.add-icon {
  font-size: 35px;
  background: #1da57a;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  left: 255px;
}
.group-icon {
  font-size: 14px;
  margin-left: 10px;
  color: #c0c4cc;
}
.group-icon:hover {
  color: #303133;
}
.ant-tabs-nav {
  margin-left: 25px;
}
</style>
