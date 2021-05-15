<template>
  <div class="Container-BeginUse">
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item class="pathActive">使用说明</el-breadcrumb-item>
      <el-breadcrumb-item class="active">查看帮助</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="Tabs">
      <el-tabs tab-position="top" v-model="tabsActiveName">
        <el-tab-pane label="开始使用" name="begin">
          <el-card>
            <h3>第一步</h3>
            <p>1、软件首次使用者获得授权方的注册账号及密码；</p>
            <p>2、该账号为系统管理员，具有Root权限；</p>
            <p>
              3、使用该账号登录后可先更改密码，然后创建一个具有管理员权限的用户进行日常管理。
            </p>
          </el-card>
          <el-card>
            <h3>第二步</h3>
            <p>
              使用管理员账号登录后可创建并管理普通用户账号，分配普通用户权限，权限分为：
            </p>
            <p style="margin-top: 10px">
              <span style="font-weight: bold">Creator</span> -
              可创建维护设备、保养标准及协助<span style="font-weight: bold">
                Supervisor </span
              >分配保养任务和查看维修任务，<span style="font-weight: bold">
                但不能进行数据分析 </span
              ><br />
              <span style="font-weight: bold">Supervisor</span> -
              可查看设备清单，可管理、分配保养和维修任务及进行数据分析，<span
                style="font-weight: bold"
              >
                但不能创建和编辑 </span
              ><br />
              <span style="font-weight: bold">Operator</span> -
              可对分配到自己的设备进行保养、维修及报修
            </p>
            <img
              src="@/assets/LeadtoUse/beginuseinfo1.png"
              style="width: 70%; margin-top: 10px"
            />
          </el-card>
          <el-card>
            <h3>第三步</h3>
            <p>
              1、用户使用管理员分配的账号及密码登录，密码可在登录后进行修改；
            </p>
            <p>2、当前登录用户的信息和权限显示在程序界面右上角。</p>
          </el-card>
          <el-card>
            <h3>第四步</h3>
            <p>用户根据权限完成相应的设备管理、保养维修及数据分析任务</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="first">
          <el-card>
            <h3>创建管理员账号</h3>
            <p>1、以Root权限账号和密码登录系统；</p>
            <p>
              2、在"用户管理"菜单项下，点击<a href="./#/authorize">人员管理</a
              >；
            </p>
            <p>3、填入管理员用户注册信息，其中权限可随意选择；</p>
            <p>4、点击"注册"按钮完成用户注册；</p>
            <p>
              5、重新回到<a href="./#/authorize">人员管理</a
              >页面在右侧的授权区选择管理员用户名；
            </p>
            <p>6、更改权限为ADMIN。</p>
          </el-card>
          <el-card>
            <h3>创建普通用户账号</h3>
            <p>1、以Root权限账号和密码登录系统；</p>
            <p>
              2、在"用户管理"菜单项下，点击<a href="./#/authorize">人员管理</a
              >；
            </p>
            <p>3、填入普通用户注册信息，根据需要选择权限；</p>
            <p>4、点击"注册"按钮完成用户注册。</p>
          </el-card>
          <el-card>
            <h3>更改注册信息</h3>
            <p>1、以自己的账号和密码登录系统；</p>
            <p>
              2、在"用户管理"菜单项下，点击<a href="./#/edituser">修改信息</a>；
            </p>
            <p>3、可修改姓名、头像、邮箱和密码；</p>
            <p>4、修改完成后，点击"保存修改"按钮。</p>
          </el-card>
          <el-card>
            <h3>管理员修改普通用户注册信息</h3>
            <p>1、以管理员账号和密码登录系统；</p>
            <p>
              2、在"用户管理"菜单项下，点击<a href="./#/userList">用户列表</a
              >，可看到当前所有注册用户；
            </p>
            <p>3、选择需要修改信息的用户，在最右列的"操作"项下点击"修改"；</p>
            <p>4、更新用户注册信息；</p>
            <p>5、点击"保存修改"按钮。</p>
          </el-card>
          <el-card>
            <h3>管理员删除普通用户</h3>
            <p>1、以管理员账号和密码登录系统；</p>
            <p>
              2、在"用户管理"菜单项下，点击<a href="./#/userList">用户列表</a
              >，可看到当前所有注册用户；
            </p>
            <p>3、选择需要删除的用户，在最右列的"操作"项下点击"删除"；</p>
            <p>4、该用户将从用户列表中删除，不能再登录系统。</p>
          </el-card>
          <el-card>
            <h3>管理员更改普通用户权限</h3>
            <p>1、以管理员账号和密码登录系统；</p>
            <p>
              2、在"用户管理"菜单项下，点击<a href="./#/authorize">人员管理</a
              >；
            </p>
            <p>3、在右侧的授权区选择要更改权限的用户及新的权限；</p>
            <p>4、点击"保存修改"按钮。</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="设备管理" name="second">
          <el-card>
            <h3>从空白模板创建设备信息</h3>
            <p>
              1、在"设备管理"菜单项下，点击<a href="./#/addDevice">新增设备</a
              >；
            </p>
            <p>
              2、根据字段名填入相应的字段信息（程序预置了基本字段，为必填项）；
            </p>
            <p>
              3、如需增加新的字段，点击右边拓展信息下的"新增字段"按钮，并输入字段名和字段信息；
            </p>
            <p>4、保存提交；</p>
            <p>
              5、在<a href="./#/deviceInformation">设备信息</a
              >中，可以看到当前设备清单；
            </p>
          </el-card>
          <el-card>
            <h3>从EXCEL文件导入设备信息</h3>
            <p>
              1、在"设备管理"菜单项下点击<a href="./#/addDevice">新增设备</a
              >，创建一条设备记录；
            </p>
            <p>
              2、在新增设备页面点击"新增字段"按钮，创建EXCEL文件中需要导入的字段；
            </p>
            <p>
              3、在"设备管理"菜单项下点击<a href="./#/deviceInformation"
                >设备信息</a
              >，确保所有需导入的字段都出现在列表中，然后将此条设备记录删除；
            </p>
            <p>
              4、点击<a href="./#/deviceInformation">设备信息</a
              >页面上方的"导出"按钮，将在系统默认目录下生成空的EXCEL文件；
            </p>
            <p>5、将要导入的EXCEL文件中内容复制到生成的EXCEL文件中并保存；</p>
            <p>6、点击"导入"按钮，选择导入生成的EXCEL文件；</p>
            <p>
              7、在<a href="./#/deviceInformation">设备信息</a
              >中，可以看到从EXCEL文件导入的设备清单；
            </p>
          </el-card>
          <el-card>
            <h3>修改设备信息</h3>
            <p>
              1、在"设备管理"菜单项下点击<a href="./#/deviceInformation"
                >设备信息</a
              >；
            </p>
            <p>2、在设备列表页面的最右列的"操作"项下，点击"修改"；</p>
            <p>3、在设备信息编辑框中修改设备信息；</p>
            <p>4、点击"确认修改"按钮。</p>
          </el-card>
          <el-card>
            <h3>修改设备字段</h3>
            <p>
              1、在"设备管理"菜单项下，点击<a href="./#/addDevice">新增设备</a
              >；
            </p>
            <p>
              2、在<a href="./#/addDevice">新增设备</a
              >页面的"拓展信息"下能看到用户自行添加的设备字段；
            </p>
            <p>
              3、点击"修改字段"按钮，在跳出的对话框中选择要更改的字段及更改内容；
            </p>
            <p>4、点击"确定"按钮。</p>
          </el-card>
          <el-card>
            <h3>删除单台设备</h3>
            <p>
              1、在"设备管理"菜单项下点击<a href="./#/deviceInformation"
                >设备信息</a
              >；
            </p>
            <p>2、在设备列表页面中找到要删除的设备；</p>
            <p>3、在最右列的"操作"项下，点击"删除"。</p>
          </el-card>
          <el-card>
            <h3>删除多台设备</h3>
            <p>
              1、在"设备管理"菜单项下点击<a href="./#/deviceInformation"
                >设备信息</a
              >；
            </p>
            <p>
              2、在设备列表页面勾选要删除的设备或利用设备查询功能选出要删除的设备并勾选全部；
            </p>
            <p>3、点击右上角的"批量删除"按钮。</p>
          </el-card>
          <el-card>
            <h3>删除设备字段</h3>
            <p>
              1、在"设备管理"菜单项下，点击<a href="./#/addDevice">新增设备</a
              >；
            </p>
            <p>
              2、在<a href="./#/addDevice">新增设备</a
              >页面的"拓展信息"下能看到用户自行添加的设备字段；
            </p>
            <p>3、勾选需要删除的字段名；</p>
            <p>
              4、点击"删除字段"按钮。（注意：
              <span style="font-weight: bold">
                该操作将删除所有在设备列表中已经生成的设备相应字段及其内容 </span
              >）
            </p>
          </el-card>
          <el-card>
            <h3>设备查询</h3>
            <p>
              1、在"设备管理"菜单项下点击<a href="./#/deviceInformation"
                >设备信息</a
              >；
            </p>
            <p>2、在设备列表页面上方的下拉框中选择按照哪个字段查询；</p>
            <p>3、在跳出的对话框中输入该字段的查询内容；</p>
            <p>4、点击确定后该搜索条件将显示在下拉框和搜索按钮之间；</p>
            <p>5、可重复第2-4步设定多个字段的组合查询条件；</p>
            <p>6、点击"搜索"按钮，符合查询条件的设备将显示在设备列表中。</p>
          </el-card>
          <el-card>
            <h3>导出设备信息到EXCEL文件</h3>
            <p>
              1、在"设备管理"菜单项下点击<a href="./#/deviceInformation"
                >设备信息</a
              >；
            </p>
            <p>
              2、在设备列表页面上方点击"获取全部设备"按钮，或设定条件查询设备；
            </p>
            <p>3、点击"导出"按钮，将在系统默认目录下生成EXCEL文件。</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="设备保养" name="third">
          <el-card>
            <h3>从空白模板创建保养标准</h3>
            <p>
              1、在"设备保养"菜单项下，点击<a href="./#/addTask">新增标准</a>；
            </p>
            <p>2、点击"新增标准"按钮；</p>
            <p>
              3、在页面中输入用户自行定义的标准名、标准编号、保养周期等基本项；
            </p>
            <p>
              4、在页面右侧的保养内容部分，点击"+"输入标题项（通常为保养执行步骤），再输入具体保养内容。保养内容输入支持Rich
              Text（富文本编辑）格式，并可插入图片。可重复点击"+"输入多个保养步骤；
            </p>
            <p>5、完成全部输入后点击"保存并提交"按钮；</p>
            <p>
              6、在<a href="./#/addTask">新增标准</a
              >页面可以看到当前已创建的保养标准清单。
            </p>
          </el-card>
          <el-card>
            <h3>从已有模板创建保养标准</h3>
            <p>
              1、在"设备保养"菜单项下，点击<a href="./#/addTask">新增标准</a>；
            </p>
            <p>2、在新增标准页面找到某个已创建的保养标准；</p>
            <p>3、在最右列的"操作"项下点击"以此为模板新增"；</p>
            <p>
              4、在新增标准页面上修改已有保养标准的变化部分。如需修改保养内容，点击保养内容标题项，在弹出的"功能选择"对话框中选择"修改内容"；
            </p>
            <p>5、完成修改后点击"保存并提交"按钮。</p>
          </el-card>
          <el-card>
            <h3>修改保养标准</h3>
            <p>
              1、在"设备保养"菜单项下，点击<a href="./#/addTask">新增标准</a>；
            </p>
            <p>2、在新增标准页面找到需要修改的保养标准；</p>
            <p>3、在最右列的"操作"项下点击"修改标准"；</p>
            <p>
              4、编辑需要修改的部分。如需修改保养内容，点击保养内容标题项，在弹出的"功能选择"对话框中选择"修改内容"；
            </p>
            <p>5、完成修改后点击"保存并提交"按钮。</p>
          </el-card>
          <el-card>
            <h3>删除保养标准</h3>
            <p>
              1、在"设备保养"菜单项下，点击<a href="./#/addTask">新增标准</a>；
            </p>
            <p>2、在新增标准页面找到需要删除的保养标准；</p>
            <p>3、在最右列的"操作"项下点击"删除"；</p>
            <p>4、也可勾选多个要删除的保养标准并点击右上角的"批量删除"按钮。</p>
          </el-card>
          <el-card>
            <h3>分配保养任务</h3>
            <p>
              1、在"设备保养"菜单项下，点击<a href="./#/tssignTask">任务分配</a
              >；
            </p>
            <p>
              2、按照页面提示选择待保养的设备、保养标准、保养执行人员以及下次保养开始时间；
            </p>
            <p>3、保存并提交；</p>
            <p>
              4、点击<a href="./#/totalTaskList">保养列表</a
              >可看到针对每台设备所分配的保养任务。
            </p>
          </el-card>
          <el-card>
            <h3>修改保养任务</h3>
            <p>
              1、在<a href="./#/totalTaskList">保养列表</a
              >页面找到需要修改的保养任务；
            </p>
            <p>2、在最右列"操作"任务下点击"修改"；</p>
            <p>
              3、在修改任务分配页面中可更改对当前设备分配的保养人员及下次保养开始时间。（注意：
              <span style="font-weight: bold">
                如需更改保养任务参照的保养标准，则需要先删除该保养任务，再重新分配 </span
              >）；
            </p>
            <p>4、保存并提交。</p>
          </el-card>
          <el-card>
            <h3>删除保养任务</h3>
            <p>
              1、在<a href="./#/totalTaskList">保养列表</a
              >页面找到需要修改的保养任务；
            </p>
            <p>
              2、在最右列"操作"任务下点击"解绑"。该操作将与某台设备提供任务分配绑定的保养标准和人员解除绑定。
            </p>
          </el-card>
          <el-card>
            <h3>在Web端执行保养任务</h3>
            <p>
              1、在<a href="./#/totalTaskList">保养列表</a
              >页面找到需要执行的保养任务；
            </p>
            <p>2、在最右列"操作"任务下点击"执行"；</p>
            <p>3、参照保养内容执行具体步骤，每步执行完毕后勾选该步骤标题；</p>
            <p>
              4、所有步骤完成并勾选后，填写底部的保养记录，该记录支持Rich
              Text格式编辑（富文本编辑）并可上传图片；
            </p>
            <p>
              5、若保养执行中发现保养人员不能自我修复的问题，打开"是否不能自我修复"开关到"是"状态。否则忽略此步骤；
            </p>
            <p>
              6、点击"提交"。若第5步存在不能自我修复的问题，则保养任务提交后会自动进入故障<a
                href="./#/fixApply"
                >报修申请</a
              >页面。请参照故障报修相关操作进行后续处理。
            </p>
          </el-card>
          <el-card>
            <h3>在移动端执行保养任务</h3>
            <p>
              1、以 Operator
              权限用户ID登录后，在首页上可直接看到分配到此ID的保养和维修任务；
            </p>
            <p>2、点击任务后进入具体的任务执行页面；</p>
            <p>3、按步骤执行保养内容并勾选相应步骤；</p>
            <p>4、所有步骤完成并勾选后，填写底部的保养记录并可上传图片。</p>
          </el-card>
          <el-card>
            <h3>查询保养任务</h3>
            <p>
              1、在<a href="./#/totalTaskList">保养列表</a
              >页面上方的下拉框选择按哪个字段查询；
            </p>
            <p>2、在跳出的对话框中输入该字段的查询内容；</p>
            <p>3、点击确定后该搜索条件将显示在下拉框和搜索按钮之间；</p>
            <p>4、可重复第1步到第3步设定多个字段的组合查询条件；</p>
            <p>5、点击"查询"按钮。</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="设备维修" name="fourth">
          <el-card>
            <h3>设备故障报修申请</h3>
            <p>
              1、在"设备维修"菜单项下，点击<a href="./#/fixApply">报修申请</a>；
            </p>
            <p>
              2、在报修申请页面通过下拉框选择故障设备。（Tips：
              <span style="font-weight: normal">
                下拉框中无设备可选时，需要输入故障设备编号，点击查找按钮。查找成功后该设备将进入下拉框可供选择。</span
              ><span style="font-weight: bold">
                Tips中功能仅对 Operator 权限开放 </span
              >）；
            </p>
            <p>3、在异常描述和处理请求编辑框输入文字或图片；</p>
            <p>
              4、输入完成后在底部的下拉框选择提交给管理人员。只有具备 Supervisor
              权限的用户才能出现在下拉框中供选择；
            </p>
            <p>
              5、在"设备维修"菜单项下点击<a href="./#/mySubmit">我发布的</a
              >，可以看到当前用户报修申请的处理状态变为"已申请"。
            </p>
          </el-card>
          <el-card>
            <h3>分配报修任务</h3>
            <p>
              1、具有 Supervisor 权限的用户登录后，在"设备维修"菜单项下点击<a
                href="./#/alreadyFix"
                >分配到我的</a
              >，可以看到所有提交给当前用户的报修申请；
            </p>
            <p>2、点击最右列"操作"项下的"查看详情"；</p>
            <p>3、在"查看详情"页面"分配"这一步下，点击"分配此申请"按钮；</p>
            <p>4、在跳出的对话框中选择维修人员，并点击"确定"按钮；</p>
            <p>
              5、在"查看详情"页面上方的时间线中可以看到当前维修任务的分配已完成。报修列表中的"维修状态"变为"已分配"。
            </p>
          </el-card>
          <el-card>
            <h3>在Web端执行报修任务</h3>
            <p>
              1、以 Operator 权限用户ID登录，在“设备维修“菜单项下点击<a
                href="./#/alreadyFix"
                >分配到我的</a
              >；
            </p>
            <p>2、选择要处理的维修任务，在最右列的"操作"项下点击"查看详情"；</p>
            <p>
              3、在"查看详情"页面"修复"这一步下，输入故障诊断和修复情况，然后点击"确认提交"；
            </p>
            <p>
              4、在"查看详情"页面上方的时间线中可以看到当前维修任务的修复已完成。报修列表中的"维修状态"变为"已修复"。
            </p>
            <p>
              5、报修人员在"设备维修"菜单项下点击<a href="./#/mySubmit"
                >我发布的</a
              >；
            </p>
            <p>
              6、在<a href="./#/mySubmit">我发布的</a
              >页面找到维修状态为"已修复"的任务，在最右列的操作项下点击"查看详情"；
            </p>
            <p>
              7、在查看详情页面"完成"这一步下，点击"确认"按钮，上方的时间线中可以看到当前维修任务已完成。报修列表中的"维修状态"变为"已完成"。任务结束。
            </p>
            <p>
              8、若报修人员认为仍然存在故障，可点击"拒绝"按钮，维修任务的状态退回到"已分配"，由维修人员重新进行维修诊断直至报修人员最终确认。
            </p>
          </el-card>
          <el-card>
            <h3>在移动端执行报修任务</h3>
            <p>
              1、以 Operator
              权限用户ID登录后，在首页上可直接看到分配到此ID的保养和维修任务；
            </p>
            <p>
              2、在维修任务下点击待处理的异常设备，可看到具体的异常描述和维修需求；
            </p>
            <p>3、点击"开始维修"按钮；</p>
            <p>
              4、按要求记录维修过程。其中解决措施部分支持Rich
              Text文本输入及图片上传；
            </p>
            <p>5、点击"维修完成"按钮；</p>
          </el-card>
          <el-card>
            <h3>查询报修任务</h3>
            <p>
              1、在"设备维修"菜单项下，点击<a href="./#/allError">全部报修</a>；
            </p>
            <p>
              2、在全部报修列表页面上方的下拉框中选择查询字段，设定查询内容；
            </p>
            <p>3、点击确定后该搜索条件将显示在下拉框和搜索按钮之间；</p>
            <p>4、可重复第1步到第3步设定多个字段的组合查询条件；</p>
            <p>5、点击"查询"按钮。</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="数据分析" name="fifth">
          <el-card>
            <h3>使用日志</h3>
            <p>
              点击<a href="./#/dailyRecord">使用日志</a
              >可查看用户登录情况及进行的操作。（<span
                style="font-weight: bold"
              >
                仅对管理员开放</span
              >）
            </p>
          </el-card>
          <el-card>
            <h3>保养分析</h3>
            <p>1、点击<a href="./#/taskAnalysis">保养分析</a>；</p>
            <p>
              2、确定分析范围。可通过选择设备、人员、保养及时间段来确定数据分析的范围；
            </p>
            <p>3、结果显示在分析范围内的应该执行的保养总数、完成率等指标。</p>
          </el-card>
          <el-card>
            <h3>维修分析</h3>
            <p>1、点击<a href="./#/fixAnalysis">维修分析</a>；</p>
            <p>
              2、确定分析范围。可通过选择设备、人员及时间段来确定数据分析的范围；
            </p>
            <p>
              3、结果显示在分析范围内设备故障总时间、平均维修耗时（MTTR）及平均故障周期（MTBF）等指标。
            </p>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabsActiveName: "begin",
    };
  },
};
</script>

<style lang="scss">
.Container-BeginUse {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  background: #fafafa;
  .breadcrumb {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    font-size: 16px;
    // border: 1px solid red;
    padding: 10px 0;
    .el-breadcrumb__inner {
      font-weight: bold;
      margin-left: 10px;
    }
    .active {
      font-size: 20px;
    }
  }
  .Tabs {
    // border: 1px solid red;
    margin: 0 10px;
    a {
      font-weight: bold;
      text-decoration: none;
      color: #409eff;
      padding: 0 2px;
    }
    .el-card {
      margin: 20px 10px;
    }
    p {
      font-size: 14px;
    }
    h3 {
      margin-bottom: 10px;
    }
  }
}
</style>
