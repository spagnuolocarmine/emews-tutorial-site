<?php
$path = rtrim(str_replace("index.php", "", $_SERVER['SCRIPT_FILENAME']),"/");

            $users = file_exists($path . "/data/users.php");
            $projects = file_exists($path . "/data/projects.php");
            $active = file_exists($path . "/data/active.php");

            if(!$users && !$projects && !$active){
                // Installer
                require_once('components/install/view.php');
            }else{
                // Login form
?>
          
                   
                <div style="float:left;
                    padding:0 10px;
                    margin:-43px 0 0 -10px;
                    background:#1a1a1a; font-size:17px;"> <?php i18n("Administrator Login"); ?></div>
                    <form id="login" method="post" >

                        <label><span class="icon-user login-icon"></span> <?php i18n("Username"); ?></label>
                        <input type="text" name="username" autocomplete="off">

                        <label><span class="icon-lock login-icon"></span> <?php i18n("Password"); ?></label>
                        <input type="password" name="password">
                        
                        <div class="language-selector">
                            <label><span class="icon-picture login-icon"></span> <?php i18n("Theme"); ?></label>
                            <select name="theme" id="theme">
                                <option value="default"><?php i18n("Default"); ?></option>
                                <?php
                                include 'languages/code.php';
                                foreach($themes as $theme): 
                                    if(file_exists(THEMES."/" . $theme . "/theme.json")) {
                                        $data = file_get_contents(THEMES."/" . $theme . "/theme.json");
                                        $data = json_decode($data,true);
                                    ?>
                                    <option value="<?php echo $theme; ?>" <?php if($theme == THEME) { echo "selected"; } ?>><?php if($data[0]['name'] != '') { echo $data[0]['name']; } else { echo $theme; } ?></option>
                                <?php } endforeach; ?>
                            </select>
                            <label><span class="icon-language login-icon"></span> <?php i18n("Language"); ?></label>
                            <select name="language" id="language">
                                <?php
                                include 'languages/code.php';
                                foreach(glob("languages/*.php") as $filename): 
                                    $lang_code = str_replace(array("languages/", ".php"), "", $filename);
                                    if(!isset($languages[$lang_code])) continue;
                                    $lang_disp = ucfirst(strtolower($languages[$lang_code]));
                                    ?>
                                    <option value="<?php echo $lang_code; ?>" <?php if ($lang_code == "en"){echo "selected";}?>><?php echo $lang_disp; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <button><?php i18n("Login"); ?></button>

                        <a class="show-language-selector"><?php i18n("More"); ?></a>

                 </form>
                <script src="components/user/init.js"></script>
                </div>
          
        <?php } ?>